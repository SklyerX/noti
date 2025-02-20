"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";

export function MainNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/docs"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs" ? "text-foreground" : "text-foreground/80",
          )}
        >
          Docs
        </Link>
        <Link
          href="/pricing"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/pricing" ? "text-foreground" : "text-foreground/80",
          )}
        >
          Pricing
        </Link>
        {!isLoading && isAuthenticated && (
          <Link
            href="/dashboard"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/pricing"
                ? "text-foreground"
                : "text-foreground/80",
            )}
          >
            Dashboard
          </Link>
        )}
      </nav>
    </div>
  );
}
