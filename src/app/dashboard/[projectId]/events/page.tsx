"use client";

import { Check, Dot, X } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CopyButton from "./_components/copy-button";
import { fetchEventsAction } from "./_actions/get-events";
import type { Event } from "@/db/schema";

const ITEMS_PER_PAGE = 10;

export default function EventsPage() {
  const { projectId } = useParams();
  const { execute, status, result } = useAction(fetchEventsAction);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    if (isLoading || !hasMorePages) return;

    setIsLoading(true);
    execute({
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      projectId: projectId as string,
    });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result.data) {
      // Only add new events that aren't already in the array
      const newEvents = result.data.events || [];
      // @ts-ignore
      setAllEvents((prev) => {
        const existingIds = new Set(prev.map((event) => event.id));
        const uniqueNewEvents = newEvents.filter(
          (event) => !existingIds.has(event.id),
        );
        return [...prev, ...uniqueNewEvents];
      });

      setHasMorePages(currentPage < result.data.metadata.totalPages);
      setIsLoading(false);
    }
  }, [status, result.data, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMorePages && !isLoading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMorePages, isLoading]);

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  return (
    <div>
      <h3 className="text-2xl font-semibold">
        Events
        <span className="text mx-2 font-normal">
          ({result.data?.metadata.eventCount})
        </span>
      </h3>

      <div className="mt-5 space-y-4">
        {allEvents.map((event) => (
          <div className="border rounded-lg" key={event.id}>
            <div className="border-b rounded-t-lg p-4 bg-muted/30 flex items-center justify-between">
              <h3 className="text-sm">{event.title}</h3>
              <div className="flex gap-2 text-muted-foreground">
                <span className="text-xs">{event.id}</span>
                <Dot className="size-4" />
                <span className="text-xs">
                  {formatDistanceToNowStrict(event.createdAt, {
                    addSuffix: true,
                  })}
                </span>
                <Dot className="size-4" />
                <p className="text-muted-foreground text-xs inline-flex items-center gap-2">
                  {event.status === "sent" ? (
                    <Check className="size-3.5" />
                  ) : (
                    <X className="size-3.5" />
                  )}
                  <span>{event.status === "sent" ? "Sent" : "Failed"}</span>
                </p>
                {event.status === "failed" && (
                  <>
                    <Dot className="size-4" />
                    <p className="text-muted-foreground text-xs inline-flex items-center gap-2">
                      {event.retryCount} Retries
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="p-4">
              <p>{event.message || "No message"}</p>
              <div className="flex flex-wrap items-center mt-2">
                {event.fields?.map((field) => (
                  <div key={field.name}>
                    <p className="font-semibold">{field.name}</p>
                    <p>{field.value}</p>
                  </div>
                ))}
              </div>
              {event.metadata && (
                <div className="mt-4 relative">
                  <pre className="whitespace-pre-wrap overflow-x-scroll overflow-y-scroll w-full h-52 border rounded-md bg-muted p-4 text-muted-foreground">
                    <code>{JSON.stringify(event.metadata, null, 2)}</code>
                  </pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={JSON.stringify(event.metadata)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        {hasMorePages && (
          <div ref={loaderRef} className="py-4 text-center">
            {isLoading ? "Loading..." : "Scroll for more"}
          </div>
        )}

        {!hasMorePages && (
          <div className="py-4 text-center text-gray-500">
            No more items to load
          </div>
        )}
      </div>
    </div>
  );
}
