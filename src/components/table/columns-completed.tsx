"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  CircleAlert,
  CircleX,
} from "lucide-react";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ScheduledJob } from "@/client";
import { DataTableConfig } from "./data-table";
import { columnsScheduled, triggerTypes } from "./columns-scheduled";

export const columnsCompleted: ColumnDef<ScheduledJob>[] = [
  columnsScheduled[0]!,
  columnsScheduled[1]!,
  columnsScheduled[2]!,
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
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    accessorFn: (originalRow) => originalRow.name?.toString() ?? "",
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
