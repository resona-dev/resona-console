"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { FacetedFilter, FacetedFilterOption } from "./faceted-filter";
import { RefreshCwIcon } from "lucide-react";
import { AsyncButton } from "../async-button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: {
    accessorKey: string;
    title: string;
    options: FacetedFilterOption[];
  }[];
  refetch?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  refetch,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search ..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
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
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {refetch && (
        <AsyncButton
          variant="outline"
          size="sm"
          // isLoading={queryClient.isFetching({ queryKey: queryKey }) > 0}
          onClick={refetch}
        >
          <RefreshCwIcon className="mr-2 h-4 w-4"></RefreshCwIcon>
          Refresh
        </AsyncButton>
      )}
    </div>
  );
}
