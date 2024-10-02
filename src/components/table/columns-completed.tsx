"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCheckIcon,
  CrossIcon,
  Repeat1Icon,
} from "lucide-react";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { JobStatusBadge } from "@/components/job-status-badge";
import { JobTypeBadge } from "@/components/job-type-badge";
import { ScheduledJob, JobStatus } from "@/client";
import { getAllCompletedJobsQueryKey } from "@/client/@tanstack/react-query.gen";
import { DataTableConfig } from "./data-table";

export const columnsCompleted: ColumnDef<ScheduledJob>[] = [
  {
    accessorKey: "id",
    header: "Job ID",
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
    accessorKey: "result.completed_at",
    sortDescFirst: true,
    invertSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Completed At
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
      const completedAt = row.original.result?.completed_at;
      if (!completedAt) {
        return (
          <div className="text-muted-foreground h-10 content-center">N/A</div>
        );
      }

      return new Date(completedAt).toLocaleString();
    },
  },
];

const statuses = [
  {
    value: "successful",
    label: "Successful",
    icon: CheckCheckIcon,
  },
  {
    value: "response-error",
    label: "Response Error",
    icon: CrossIcon,
  },
  {
    value: "request-error",
    label: "Request Error",
    icon: CrossIcon,
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

export const completedJobsConfig: DataTableConfig = {
  queryKey: getAllCompletedJobsQueryKey(),
  initialSort: [{ id: "result_completed_at", desc: true }],
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