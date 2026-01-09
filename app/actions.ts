"use server";

import {
  getAllProjects,
  createProject,
  deleteProject,
  createTask,
  updateTask,
  deleteTask,
  updateProject,
  getAllTaskStatuses,
  searchProjects,
} from "@/lib/services";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Helper to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function getProjectsAction(userId: string) {
  return await getAllProjects(userId);
}

export async function getTaskStatusesAction() {
  return await getAllTaskStatuses();
}

export async function createProjectAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;

  if (!title || !userId) {
    throw new Error("Title and userId are required");
  }

  const project = await createProject({
    title,
    description: description || undefined,
    userId,
  });

  revalidatePath("/");
  return project;
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const project = await updateProject(projectId, userId, {
    title: title || undefined,
    description: description || undefined,
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  revalidatePath("/");
  revalidatePath(`/projects/${projectId}`);
  return project;
}

export async function deleteProjectAction(projectId: string) {
  const userId = await getAuthenticatedUserId();
  const deleted = await deleteProject(projectId, userId);

  if (!deleted) {
    throw new Error("Project not found or access denied");
  }

  revalidatePath("/");
}

export async function createTaskAction(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const statusId = formData.get("status") as string;
  const projectId = formData.get("projectId") as string;

  if (!title || !projectId || !statusId) {
    throw new Error("Title, projectId, and statusId are required");
  }

  const task = await createTask(userId, {
    title,
    description: description || undefined,
    statusId,
    projectId,
  });

  if (!task) {
    throw new Error("Project not found or access denied");
  }

  revalidatePath(`/projects/${projectId}`);
  return task;
}

export async function updateTaskAction(taskId: string, formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const statusId = formData.get("status") as string;

  const task = await updateTask(taskId, userId, {
    title: title || undefined,
    description: description || undefined,
    statusId: statusId || undefined,
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  revalidatePath(`/projects/${task.projectId}`);
  return task;
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  const userId = await getAuthenticatedUserId();
  const deleted = await deleteTask(taskId, userId);

  if (!deleted) {
    throw new Error("Task not found or access denied");
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function searchProjectsAction(searchQuery: string) {
  const userId = await getAuthenticatedUserId();
  return await searchProjects(userId, searchQuery);
}
