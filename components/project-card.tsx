"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectWithTasks } from "@/lib/services";
import { Calendar, Clock } from "lucide-react";

interface ProjectCardProps {
  project: ProjectWithTasks;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col ring-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || "No description"}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {project.taskCount || 0} {project.taskCount === 1 ? "task" : "tasks"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
