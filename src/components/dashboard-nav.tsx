import type { User } from "@/db/schema";
import { Book, Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserDropdown from "./user-dropdown";
import { buttonVariants } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

interface Props {
  user: User;
}

export default function DashboardNav(props: Props) {
  return (
    <nav className="border-b py-5 px-20 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Send className="size-5" />
        <span className="text-xl font-bold">Noti</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/docs"
          className={buttonVariants({
            variant: "ghost",
            className: "flex items-center gap-2",
          })}
        >
          <Book />
          <span>Documentation</span>
        </Link>
        <UserDropdown user={props.user} />
      </div>
    </nav>
  );
}
