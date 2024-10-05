"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCheckIcon,
  LoaderIcon,
  PauseIcon,
  Repeat1Icon,
} from "lucide-react";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { JobStatus, ScheduledJob } from "@/client/types.gen";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { JobStatusBadge } from "@/components/job-status-badge";
import { Countdown } from "@/components/countdown";
import { JobTypeBadge } from "@/components/job-type-badge";
import { JobContextMenu } from "@/components/job-context-menu";
import { getAllJobsQueryKey } from "@/client/@tanstack/react-query.gen";
import { DataTableConfig } from "./data-table";

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
    id: "type",
    accessorKey: "trigger.type",
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.original.trigger.type;
      return <JobTypeBadge type={type} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: JobStatus = row.getValue("status");
      return <JobStatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
      if (nextRunTime === null) {
        return (
          <div className="text-muted-foreground h-10 content-center">N/A</div>
        );
      }

      return (
        <>
          <div className="">{nextRunTime}</div>
          <div className="text-sm text-muted-foreground">
            in <Countdown targetTime={nextRunTime} />
          </div>
        </>
      );
    },
  },
  {
    id: "actions",
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <JobContextMenu variant="ghost" job={row.original} className="" />
        </div>
      );
    },
  },
];

const statuses = [
  {
    value: "active",
    label: "Active",
    icon: CheckCheckIcon,
  },
  {
    value: "paused",
    label: "Paused",
    icon: PauseIcon,
  },
  {
    value: "pending",
    label: "Pending",
    icon: LoaderIcon,
  },
];

const triggerTypes = [
  {
    value: "cron",
    label: "Cron",
    icon: Repeat1Icon,
  },
  {
    value: "one-time",
    label: "One Time",
    icon: ArrowRightIcon,
  },
];

export const scheduledJobsConfig: DataTableConfig = {
  initialSort: [{ id: "next_run_time", desc: true }],
  filters: [
    {
      accessorKey: "type",
      title: "Type",
      options: triggerTypes,
    },
    {
      accessorKey: "status",
      title: "Status",
      options: statuses,
    },
  ],
};
