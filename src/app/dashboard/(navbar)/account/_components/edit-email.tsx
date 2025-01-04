"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect } from "react";
import { resetEmailAction } from "../_actions/reset-email";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  email: string;
}

export default function EditEmail({ email }: Props) {
  const [value, setValue] = React.useState(email);
  const { execute, status, result } = useAction(resetEmailAction);

  useEffect(() => {
    if (status === "hasSucceeded") {
      toast.success("Email sent!", {
        description:
          "Please check your current inbox for a reset link. You have 1h to verify.",
      });
    }
    if (status === "hasErrored") {
      toast.error("Failed to send email", {
        description:
          result.serverError || "Something went wrong, please try again later",
      });
    }
  }, [status]);

  return (
    <div>
      <Input
        value={value}
        disabled={status === "executing"}
        onChange={({ target }) => setValue(target.value)}
        placeholder="john.doe@example.com"
      />
      <Button
        className="mt-2"
        disabled={value === email || status === "executing"}
        onClick={() => execute({ email: value })}
      >
        {status === "executing" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : null}
        Save
      </Button>
    </div>
  );
}
