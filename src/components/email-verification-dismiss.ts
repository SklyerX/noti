"use server";

import { cookies } from "next/headers";

export async function handleCookieDismiss() {
  const cookieStore = await cookies();

  cookieStore.set("hide-email-verification", "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}
