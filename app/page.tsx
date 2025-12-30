import { getAllProjects } from "@/lib/services";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectCard } from "@/components/project-card";
import { ProjectSearch } from "@/components/project-search";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Proxy handles auth redirect, so session should exist
  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const projects = await getAllProjects(userId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Taskify</h1>
            <p className="text-muted-foreground mt-2">
              Manage your projects and tasks efficiently
            </p>
          </div>
          <CreateProjectDialog userId={userId} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search Projects</h2>
          <ProjectSearch userId={userId} />
        </div>

        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-semibold mb-6">All Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No projects yet. Create your first project to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
