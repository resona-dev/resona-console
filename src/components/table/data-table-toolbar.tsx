"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { FacetedFilter, FacetedFilterOption } from "./faceted-filter";
import { RefreshCwIcon } from "lucide-react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  queryKey?: QueryKey;
  filters?: {
    accessorKey: string;
    title: string;
    options: FacetedFilterOption[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  queryKey,
  filters,
}: DataTableToolbarProps<TData>) {
  const queryClient = useQueryClient();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter jobs..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters?.map((filter) => (
          <FacetedFilter
            key={filter.accessorKey}
            column={table.getColumn(filter.accessorKey)}
            title={filter.title}
            options={filter.options}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {queryKey && (
        <Button
          variant="outline"
          size="sm"
          onClick={(event) =>
            queryClient.refetchQueries({ queryKey: queryKey })
          }
        >
          <RefreshCwIcon className="mr-2 h-4 w-4"></RefreshCwIcon>
          Refresh
        </Button>
      )}
    </div>
  );
}
