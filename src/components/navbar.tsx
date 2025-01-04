import React from "react";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FaGithub } from "react-icons/fa";
import NavUser from "./nav-user";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b z-50 bg-background/95 backdrop-blur">
      <div className="container-wrapper">
        <div className="px-4 xl:px-6 2xl:px-4 mx-auto max-w-[1536px] flex h-14 items-center">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <nav className="flex items-center gap-1">
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  className: "h-10 w-10 px-0",
                })}
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="size-12" />
                <span className="sr-only">GitHub</span>
              </Link>

              <NavUser />
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
