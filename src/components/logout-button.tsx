"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { logoutAction } from "./logout-action";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
  const { execute, status } = useAction(logoutAction);

  const handleLogout = () => {
    toast.loading("Logging out...", {
      id: "logout-toast",
    });
    execute();
  };

  useEffect(() => {
    if (status === "hasSucceeded") {
      toast.dismiss("logout-toast");
    }
  }, [status]);

  return (
    <DropdownMenuItem disabled={status === "executing"} onClick={handleLogout}>
      <LogOut />
      Logout
    </DropdownMenuItem>
  );
}
