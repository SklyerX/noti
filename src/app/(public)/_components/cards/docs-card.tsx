import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Book } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DocsCard() {
  return (
    <div>
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Book className="size-5" />
        <span>Documentation</span>
      </h3>
      <p className="mt-1 text-muted-foreground">
        Simple but powerful documentation for your project. Incorporate
        Noti-Saas into your project with ease
      </p>
      <Link href="/docs" className={buttonVariants({ className: "mt-4" })}>
        Learn More <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
