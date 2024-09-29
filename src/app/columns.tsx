"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ScheduledJob } from "../client/types.gen";
import { Badge } from "@/src/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";

export const columns: ColumnDef<ScheduledJob>[] = [
  {
    accessorKey: "id",
    header: () => <div className="">Job ID</div>,
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <div className="text-right font-medium">{id}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const mapping = {
        active: "success",
        paused: "info",
        failed: "destructive",
        pending: "warning",
        completed: "secondary",
      };
      const variant =
        Object.entries(mapping).find(([key, value]) => key === status)?.[1] ??
        "default";
      return <Badge variant={variant as any}>{status}</Badge>;
    },
  },
  {
    accessorKey: "next_run_time",
    sortDescFirst: true,
    invertSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Next Run Time
          {column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <CaretSortIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(job.id!)}
            >
              Edit Job
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Pause Job</DropdownMenuItem>
            <DropdownMenuItem>Delete Job</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
