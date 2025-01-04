"use client";

import {
  AlertDialog,
  AlertDialogAction,
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
import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect } from "react";
import { deleteAccountAction } from "../_actions/delete-account-action";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const CONFIRM_PROMPT = "delete my account";

interface Props {
  disabled: boolean;
}

export default function DeleteAccount({ disabled }: Props) {
  const [value, setValue] = React.useState("");
  const { execute, status, result } = useAction(deleteAccountAction);

  const handleClick = async () => {
    if (value !== CONFIRM_PROMPT) return toast.error("Invalid confirmation");

    execute();
  };

  useEffect(() => {
    if (status === "hasSucceeded") {
      redirect("/login");
    }
    if (status === "hasErrored") {
      toast.error("Failed to delete account", {
        description:
          result.serverError || "Something went wrong, please try again later",
      });
    }
  }, [status]);

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="size-4" />
          <span>Delete Account</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action{" "}
            <strong>cannot</strong> be undone. All data relating to your account
            will be permanently deleted such as <strong>projects</strong>,{" "}
            <strong>api-keys</strong>, <strong>events</strong>, and{" "}
            <strong>subscriptions</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-1">
          <Label>
            Please type <strong>{CONFIRM_PROMPT}</strong> of the account to
            confirm
          </Label>
          <Input
            value={value}
            onChange={({ target }) => setValue(target.value)}
            className="w-full"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={value !== CONFIRM_PROMPT}
            onClick={handleClick}
            asChild
          >
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="size-4" />
              <span>Delete Account</span>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
