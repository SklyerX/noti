"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { logoutAction } from "./logout-action";

export default function LogoutButton() {
  const { execute, status } = useAction(logoutAction);

  return (
    <DropdownMenuItem
      disabled={status === "executing"}
      onClick={() => execute()}
    >
      <LogOut />
      Logout
    </DropdownMenuItem>
  );
}
