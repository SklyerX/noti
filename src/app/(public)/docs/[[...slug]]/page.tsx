import React from "react";
import { allDocs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getTableOfContents } from "@/lib/toc";
import { DashboardTableOfContents } from "../_components/toc";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { Mdx } from "../_components/mdx";

import "@/app/mdx.css";
import { ChevronRight } from "lucide-react";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export default async function DocsPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  console.log(doc?.title, doc?.slugAsParams, "DOCS");

  if (!doc) {
    notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);

  return (
    <div className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 max-w-2xl">
        <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
          <div className="truncate">Docs</div>
          <ChevronRight className="h-3.5 w-3.5" />
          <div className="text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-base text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </div>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-20 -mt-6 h-[calc(100vh-3.5rem)] pt-4">
          <div className="no-scrollbar h-full overflow-auto pb-10">
            {doc.toc && <DashboardTableOfContents toc={toc} />}
          </div>
        </div>
      </div>
    </div>
  );
}
