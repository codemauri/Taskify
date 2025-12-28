import { prismaClient } from "./db";
import { Prisma } from "@prisma/client";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
  taskCount?: number;
};

// Project operations
export async function getAllProjects(userId: string): Promise<ProjectWithTasks[]> {
  const projects = await prismaClient.$queryRaw<ProjectWithTasks[]>`
    SELECT 
      p.*,
      COUNT(t.id) as taskCount
    FROM Project p
    LEFT JOIN Task t ON t.projectId = p.id
    WHERE p.userId = ${userId}
    GROUP BY p.id
    ORDER BY p.updatedAt DESC
  `;
  
  return projects;
}

export async function getProjectById(projectId: string): Promise<ProjectWithTasks | null> {
  const projects = await prismaClient.$queryRaw<Project[]>`
    SELECT * FROM Project WHERE id = ${projectId}
  `;
  
  if (projects.length === 0) return null;
  
  const tasks = await prismaClient.$queryRaw<Task[]>`
    SELECT * FROM Task WHERE projectId = ${projectId}
    ORDER BY 
      CASE 
        WHEN status = 'In Progress' THEN 1
        WHEN status = 'Incomplete' THEN 2
        WHEN status = 'Done' THEN 3
        ELSE 4
      END,
      createdAt DESC
  `;
  
  return {
    ...projects[0],
    tasks,
  };
}

export async function createProject(data: {
  title: string;
  description?: string;
  userId: string;
}): Promise<Project> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await prismaClient.$executeRaw`
    INSERT INTO Project (id, title, description, userId, createdAt, updatedAt)
    VALUES (${id}, ${data.title}, ${data.description || null}, ${data.userId}, ${now}, ${now})
  `;
  
  const projects = await prismaClient.$queryRaw<Project[]>`
    SELECT * FROM Project WHERE id = ${id}
  `;
  
  return projects[0];
}

export async function updateProject(
  projectId: string,
  data: { title?: string; description?: string }
): Promise<Project> {
  const now = new Date().toISOString();
  
  const updates: string[] = [];
  const params: unknown[] = [];
  
  if (data.title !== undefined) {
    updates.push(`title = ?`);
    params.push(data.title);
  }
  
  if (data.description !== undefined) {
    updates.push(`description = ?`);
    params.push(data.description);
  }
  
  updates.push(`updatedAt = ?`);
  params.push(now);
  
  params.push(projectId);
  
  const query = Prisma.sql([
    `UPDATE Project SET ${updates.join(", ")} WHERE id = ?`,
  ], ...params);
  
  await prismaClient.$executeRaw(query);
  
  const projects = await prismaClient.$queryRaw<Project[]>`
    SELECT * FROM Project WHERE id = ${projectId}
  `;
  
  return projects[0];
}

export async function deleteProject(projectId: string): Promise<void> {
  await prismaClient.$executeRaw`
    DELETE FROM Project WHERE id = ${projectId}
  `;
}

// Task operations
export async function getTasksByProject(
  projectId: string,
  statusFilter?: string
): Promise<Task[]> {
  let query;
  
  if (statusFilter && statusFilter !== "all") {
    query = prismaClient.$queryRaw<Task[]>`
      SELECT * FROM Task 
      WHERE projectId = ${projectId} AND status = ${statusFilter}
      ORDER BY 
        CASE 
          WHEN status = 'In Progress' THEN 1
          WHEN status = 'Incomplete' THEN 2
          WHEN status = 'Done' THEN 3
          ELSE 4
        END,
        createdAt DESC
    `;
  } else {
    query = prismaClient.$queryRaw<Task[]>`
      SELECT * FROM Task 
      WHERE projectId = ${projectId}
      ORDER BY 
        CASE 
          WHEN status = 'In Progress' THEN 1
          WHEN status = 'Incomplete' THEN 2
          WHEN status = 'Done' THEN 3
          ELSE 4
        END,
        createdAt DESC
    `;
  }
  
  return query;
}

export async function createTask(data: {
  title: string;
  description?: string;
  status?: string;
  projectId: string;
}): Promise<Task> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const status = data.status || "Incomplete";
  
  await prismaClient.$executeRaw`
    INSERT INTO Task (id, title, description, status, projectId, createdAt, updatedAt)
    VALUES (${id}, ${data.title}, ${data.description || null}, ${status}, ${data.projectId}, ${now}, ${now})
  `;
  
  // Also update the project's updatedAt
  await prismaClient.$executeRaw`
    UPDATE Project SET updatedAt = ${now} WHERE id = ${data.projectId}
  `;
  
  const tasks = await prismaClient.$queryRaw<Task[]>`
    SELECT * FROM Task WHERE id = ${id}
  `;
  
  return tasks[0];
}

export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string; status?: string }
): Promise<Task> {
  const now = new Date().toISOString();
  
  // Get the task first to get projectId
  const existingTasks = await prismaClient.$queryRaw<Task[]>`
    SELECT * FROM Task WHERE id = ${taskId}
  `;
  
  if (existingTasks.length === 0) {
    throw new Error("Task not found");
  }
  
  const updates: string[] = [];
  const params: unknown[] = [];
  
  if (data.title !== undefined) {
    updates.push(`title = ?`);
    params.push(data.title);
  }
  
  if (data.description !== undefined) {
    updates.push(`description = ?`);
    params.push(data.description);
  }
  
  if (data.status !== undefined) {
    updates.push(`status = ?`);
    params.push(data.status);
  }
  
  updates.push(`updatedAt = ?`);
  params.push(now);
  
  params.push(taskId);
  
  const query = Prisma.sql([
    `UPDATE Task SET ${updates.join(", ")} WHERE id = ?`,
  ], ...params);
  
  await prismaClient.$executeRaw(query);
  
  // Update project's updatedAt
  await prismaClient.$executeRaw`
    UPDATE Project SET updatedAt = ${now} WHERE id = ${existingTasks[0].projectId}
  `;
  
  const tasks = await prismaClient.$queryRaw<Task[]>`
    SELECT * FROM Task WHERE id = ${taskId}
  `;
  
  return tasks[0];
}

export async function deleteTask(taskId: string): Promise<void> {
  // Get the task first to get projectId
  const tasks = await prismaClient.$queryRaw<Task[]>`
    SELECT * FROM Task WHERE id = ${taskId}
  `;
  
  if (tasks.length > 0) {
    const now = new Date().toISOString();
    
    await prismaClient.$executeRaw`
      DELETE FROM Task WHERE id = ${taskId}
    `;
    
    // Update project's updatedAt
    await prismaClient.$executeRaw`
      UPDATE Project SET updatedAt = ${now} WHERE id = ${tasks[0].projectId}
    `;
  }
}
