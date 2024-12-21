"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect } from "react";
import { deleteProjectAction } from "../_actions/delete-project-action";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface Props {
  projectId: string;
  projectName: string;
}

export default function DeleteProject({ projectId, projectName }: Props) {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { execute, status, result } = useAction(deleteProjectAction);

  useEffect(() => {
    if (status === "hasSucceeded") {
      setOpen(false);

      toast.success("Project deleted");

      redirect("/dashboard");
    }
    if (status === "hasErrored") {
      toast.error("Failed to delete project", {
        description:
          result.serverError || "Something went wrong, please try again later",
      });
    }
  }, [status]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 />
          <span>Delete Project</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this project? This action{" "}
            <strong>cannot</strong> be undone. This will permanently delete the{" "}
            <strong>{projectName}</strong> project, api-keys, and events.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 space-y-1">
          <Label>
            Please type <strong>{projectName}</strong> of the project to confirm
          </Label>
          <Input
            value={value}
            onChange={({ target }) => setValue(target.value)}
            className="w-full"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="flex items-center gap-2"
            variant="destructive"
            onClick={() => execute({ projectId })}
            disabled={value !== projectName || status === "executing"}
          >
            {status === "executing" ? (
              <Loader2 className="animate-spin size-4" />
            ) : null}
            {status === "executing" ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
