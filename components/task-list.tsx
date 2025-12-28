"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/services";
import { EditTaskDialog } from "./edit-task-dialog";
import { Circle, CircleDot, CheckCircle2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <CircleDot className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case "Incomplete":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Circle className="mr-1 h-3 w-3" />
            Incomplete
          </Badge>
        );
      case "Done":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Done
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks yet. Add your first task to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                {task.description && (
                  <CardDescription className="text-sm">
                    {task.description}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(task.status)}
                <EditTaskDialog task={task} />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
