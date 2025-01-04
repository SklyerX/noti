"use client";

import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "./ui/skeleton";
import { buttonVariants } from "./ui/button";
import UserDropdown from "./user-dropdown";
import Link from "next/link";

export default function NavUser() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return isAuthenticated && user ? (
    <UserDropdown
      pfpSize="w-8 h-8"
      user={{ email: user.email, name: user.name, picture: user.picture }}
    />
  ) : (
    <Link href="/login" className={buttonVariants({ size: "sm" })}>
      Log In
    </Link>
  );
}
