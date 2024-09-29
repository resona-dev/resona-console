"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { JobStatus, ScheduledJob } from "../client/types.gen";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { JobStatusBadge } from "@/components/job-status-badge";
import { Countdown } from "@/components/countdown";

export const columns: ColumnDef<ScheduledJob>[] = [
  {
    accessorKey: "id",
    header: () => <div className="">Job ID</div>,
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <div className="">{id}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: JobStatus = row.getValue("status");
      return <JobStatusBadge status={status} />;
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
    cell: ({ row }) => {
      const nextRunTime: string = row.getValue("next_run_time");

      return (
        <>
          <div className="font-medium">{nextRunTime}</div>
          <div className="text-sm text-muted-foreground">
            in <Countdown targetTime={nextRunTime} />
          </div>
        </>
      );
    },
  },
];
