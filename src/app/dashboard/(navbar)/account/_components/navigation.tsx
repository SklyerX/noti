"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const paths = [
  {
    href: "/dashboard/account",
    name: "General",
  },
  {
    href: "/dashboard/account/billing",
    name: "Billing",
  },
];

function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {paths.map((path) => (
        <Link
          href={path.href}
          className={cn({
            "font-semibold text-primary": pathname === path.href,
          })}
          key={path.name}
        >
          {path.name}
        </Link>
      ))}
    </nav>
  );
}

export default Navigation;
