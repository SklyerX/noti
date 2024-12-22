"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import React from "react";

interface Props {
  email: string;
}

export default function EditEmail({ email }: Props) {
  const [value, setValue] = React.useState(email);
  // const { execute, status, result } = useAction(updateUserAction);

  return (
    <div>
      <Input
        value={value}
        onChange={({ target }) => setValue(target.value)}
        placeholder="john.doe@example.com"
      />
      <Button
        className="mt-2"
        disabled={value === email}
        onClick={() => console.log("save")}
      >
        Save
      </Button>
    </div>
  );
}
