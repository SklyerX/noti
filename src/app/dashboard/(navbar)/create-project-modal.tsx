"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createProjectAction } from "./create-project";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";

export function CreateProjectButton() {
  const { execute, status, result } = useAction(createProjectAction);

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  useHotkeys("n", () => setOpen(true));

  const handleCreate = () => execute({ name });

  useEffect(() => {
    if (status === "hasSucceeded") {
      toast.success("Project created", {
        description:
          "Your project has been created, you can now start interacting with it.",
      });
      setOpen(false);
    }
    if (status === "hasErrored") {
      toast.error("Failed to create project", {
        description:
          result.serverError || "Something went wrong, please try again.",
      });
    }
  }, [status]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Project <span className="border px-1 rounded-sm">n</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <span className="font-medium">Project Name</span>
          <Input
            value={name}
            onChange={({ target }) => setName(target.value)}
            placeholder="Project Name"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
