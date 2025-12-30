import { prismaClient } from "./db";
import { Prisma } from "@prisma/client";
import { removeUndefinedProperties } from "./utils";

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
};

export type ProjectWithTaskCount = Project & {
  _count: {
    tasks: number;
  };
}

// Project operations
export async function getAllProjects(userId: string): Promise<ProjectWithTaskCount[]> {
  const projects = await prismaClient.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      _count: {
        select: { tasks: true }
      }
    }
  })
  
  return projects;
}

export async function getProjectById(projectId: string): Promise<ProjectWithTasks | null> {
  const project = await prismaClient.project.findUnique({
    where: { id: projectId },
  })
  
  if (!project) return null;
  
  // raw sql for this part because prisma doesn't support custom, case statement
  // could do this in JS, but it's most efficient to do it at the database level
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
    ...project,
    tasks,
  };

}

export async function createProject(data: {
  title: string;
  description?: string;
  userId: string;
}): Promise<Project> {
  const newProject = await prismaClient.project.create({
    data
  })
  return newProject;
}

export async function updateProject(
  projectId: string,
  data: { title?: string; description?: string }
): Promise<Project> {
  const now = new Date().toISOString();

  const projectDataToUpdate = removeUndefinedProperties(data);
  
  const updatedProject = await prismaClient.project.update({
    where: { id: projectId },
    data: {
      ...projectDataToUpdate,
      updatedAt: new Date(now),
    }
  })
  return updatedProject;
}

export async function deleteProject(projectId: string): Promise<void> {
  await prismaClient.project.delete({
    where: { id: projectId }
  })
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
  const newTask = await prismaClient.task.create({
    data
  })
  return newTask;
}

export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string; status?: string }
): Promise<Task> {
  const now = new Date().toISOString();
  // remove undefined values
  const taskDataToUpdate = removeUndefinedProperties(data);

 const updatedTask = await prismaClient.task.update({
  where: { id: taskId },
  data: {
    ...taskDataToUpdate,
    updatedAt: new Date(now),
  }
 })

 return updatedTask;
}

export async function deleteTask(taskId: string): Promise<void> {
  await prismaClient.task.delete({
    where: { id: taskId }
  });
}
