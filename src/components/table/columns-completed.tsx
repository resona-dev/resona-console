"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CircleAlert,
  CircleX,
  RepeatIcon,
} from "lucide-react";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { JobStatusBadge } from "@/components/job-status-badge";
import { JobTypeBadge } from "@/components/job-type-badge";
import { ScheduledJob, JobStatus } from "@/client";
import { DataTableConfig } from "./data-table";

export const columnsCompleted: ColumnDef<ScheduledJob>[] = [
  {
    accessorKey: "id",
    header: "Job ID & Name",
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const name = row.original.name;
      if (!name) {
        return (
          <div className="flex items-center">
            {id}
            <div className="opacity-0">
              <div>x</div>
              <div>x</div>
            </div>
          </div>
        );
      }
      return (
        <div>
          {id}
          <div className="text-muted-foreground overflow-ellipsis">{name}</div>
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    accessorFn: (originalRow) => originalRow.name?.toString() ?? "",
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
    value: "completed-successful",
    label: "Successful",
    icon: CheckIcon,
  },
  {
    value: "completed-response-error",
    label: "Response Error",
    icon: CircleAlert,
  },
  {
    value: "completed-request-error",
    label: "Request Error",
    icon: CircleX,
  },
];

const triggerTypes = [
  {
    value: "cron",
    label: "Cron",
    icon: RepeatIcon,
  },
  {
    value: "one-time",
    label: "One Time",
    icon: ArrowRightIcon,
  },
];

export const completedJobsConfig: DataTableConfig = {
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
