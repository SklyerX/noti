"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/db/schema";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import { deleteAPIKeyAction } from "../../_actions/delete-api-key";
import { useParams } from "next/navigation";
import { toggleActivateAction } from "../../_actions/toggle-activate";

export type ApiData = Pick<
  ApiKey,
  "id" | "name" | "isLive" | "lastUsedAt" | "usage" | "createdAt"
> & {};

export const columns: ColumnDef<ApiData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "isLive",
    header: "Status",
    cell: ({ row }) => {
      const apiKey = row.original;

      return (
        <span
          className={cn("font-medium", {
            "text-orange-500": !apiKey.isLive,
          })}
          data-testid="status"
        >
          {apiKey.isLive ? "Live" : "Test"}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "usage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Usage
        <span className="sr-only">Sort</span>
        <ChevronDown />
      </Button>
    ),
  },
  {
    accessorKey: "lastUsedAt",
    header: "Last Used",
    cell: ({ row }) => {
      const apiKey = row.original;

      return (
        <span
          className={cn("text-sm", {
            "text-muted-foreground opacity-50": !apiKey.lastUsedAt,
          })}
        >
          {apiKey.lastUsedAt
            ? formatDistanceToNowStrict(apiKey.lastUsedAt, {
                addSuffix: true,
              })
            : "Never"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const apiKey = row.original;

      return (
        <span
          className={cn("text-sm", {
            "text-muted-foreground opacity-50": !apiKey.createdAt,
          })}
        >
          {apiKey.createdAt
            ? formatDistanceToNowStrict(apiKey.createdAt, {
                addSuffix: true,
              })
            : "Never"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const apiKey = row.original;
      const { projectId } = useParams();

      const handleDelete = () =>
        toast.promise(deleteAPIKeyAction(apiKey.id, projectId as string), {
          success: "API Key deleted",
          loading: "Deleting...",
          error: "Failed to delete API Key",
        });

      const handleActivateClick = () =>
        toast.promise(toggleActivateAction(apiKey.id, projectId as string), {
          success: apiKey.isLive ? "API Key deactivated" : "API Key activated",
          loading: apiKey.isLive ? "Deactivating..." : "Activating...",
          error: apiKey.isLive
            ? "Failed to deactivate API Key"
            : "Failed to activate API Key",
        });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleActivateClick}>
              {!apiKey.isLive ? "Activate" : "Deactivate"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
