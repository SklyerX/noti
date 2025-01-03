import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t mt-8", className)}>
      <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="https://github.com/sklyerx"
            target="_blank"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">GitHub</span>
            <FaGithub className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href="https://x.com/cosmik_x"
            target="_blank"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">X</span>
            <BsTwitterX className="size-5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-muted-foreground">
            Built by{" "}
            <Link
              href="https://skylerx.ir"
              className="underline hover:text-foreground"
            >
              SkylerX
            </Link>{" "}
            with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
