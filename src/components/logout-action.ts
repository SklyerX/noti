"use server";

import { actionClient } from "@/lib/safe-action";
import { logout } from "@/lib/session";

export const logoutAction = actionClient.action(async () => {
  const result = await logout();
  return result;
});
