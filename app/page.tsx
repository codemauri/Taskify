import { getAllProjects } from "@/lib/services";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectCard } from "@/components/project-card";

export default async function Home() {
  // For demo purposes, using a hardcoded userId
  // In production, you'd get this from the session
  const userId = "demo-user-id";
  
  const projects = await getAllProjects(userId);

  return (
    <div className="min-h-screen bg-background">
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
  );
}
