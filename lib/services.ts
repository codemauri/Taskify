import { prismaClient } from "./db";
import { TaskStatus } from "@prisma/client";
import { removeUndefinedProperties } from "./utils";

/*
export async function searchProjects(userId: string, searchQuery: string): Promise<Project[]> {
  const sql = `
    SELECT id, title, description, createdAt, updatedAt, userId 
    FROM Project 
    WHERE userId = '${userId}' AND title LIKE '%${searchQuery}%'
  `;
  
  const results = await prismaClient.$queryRawUnsafe(sql);
  return results as Project[];
}

SELECT id, title, description, createdAt, updatedAt, userId
FROM Project
WHERE userId = ? AND title LIKE ?

params = [
  userId,
  `%${searchQuery}%`
]

' OR 1=1 --
Is treated as 'a literal string to match' NOT as SQL
*/

export async function searchProjects(userId: string, searchQuery: string): Promise<ProjectWithTaskCount[]> {
  return prismaClient.project.findMany({
    where: {
      userId,
      title: {
        contains: searchQuery,
      },
    },
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
  });
}


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
  statusId: string
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

export type TaskWithStatus = Task & {
  status: TaskStatus;
}

// Task Status operations
export async function getAllTaskStatuses(): Promise<TaskStatus[]> {
  return await prismaClient.taskStatus.findMany({
    orderBy: { sortOrder: "asc" }
  });
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

export async function getProjectById(projectId: string, userId: string) {
  const project = await prismaClient.project.findUnique({
    where: { id: projectId, userId },
    include: {
      tasks: {
        include: {
          status: true
        },
        orderBy: [
          { status: { sortOrder: 'asc' } },
          { createdAt: 'desc' }
        ]
      }
    }
  })

  return project;
}

// Helper to verify project ownership
export async function verifyProjectOwnership(projectId: string, userId: string): Promise<boolean> {
  const project = await prismaClient.project.findUnique({
    where: { id: projectId, userId },
    select: { id: true }
  });
  return project !== null;
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
  userId: string,
  data: { title?: string; description?: string }
): Promise<Project | null> {
  // Verify ownership before update
  const isOwner = await verifyProjectOwnership(projectId, userId);
  if (!isOwner) return null;

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

export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
  // Verify ownership before delete
  const isOwner = await verifyProjectOwnership(projectId, userId);
  if (!isOwner) return false;

  await prismaClient.project.delete({
    where: { id: projectId }
  })
  return true;
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    description?: string;
    statusId: string;
    projectId: string;
  }
): Promise<TaskWithStatus | null> {
  // Verify user owns the project before creating task
  const isOwner = await verifyProjectOwnership(data.projectId, userId);
  if (!isOwner) return null;

  const newTask = await prismaClient.task.create({
    data,
    include: { status: true },
  })
  return newTask;
}

export async function updateTask(
  taskId: string,
  userId: string,
  data: { title?: string; description?: string; statusId?: string }
): Promise<TaskWithStatus | null> {
  // Get task to find its project
  const task = await prismaClient.task.findUnique({
    where: { id: taskId },
    select: { projectId: true }
  });
  if (!task) return null;

  // Verify user owns the project
  const isOwner = await verifyProjectOwnership(task.projectId, userId);
  if (!isOwner) return null;

  const now = new Date().toISOString();
  const taskDataToUpdate = removeUndefinedProperties(data);

  const updatedTask = await prismaClient.task.update({
    where: { id: taskId },
    data: {
      ...taskDataToUpdate,
      updatedAt: new Date(now),
    },
    include: { status: true }
  })

  return updatedTask;
}

export async function deleteTask(taskId: string, userId: string): Promise<boolean> {
  // Get task to find its project
  const task = await prismaClient.task.findUnique({
    where: { id: taskId },
    select: { projectId: true }
  });
  if (!task) return false;

  // Verify user owns the project
  const isOwner = await verifyProjectOwnership(task.projectId, userId);
  if (!isOwner) return false;

  await prismaClient.task.delete({
    where: { id: taskId }
  });
  return true;
}
