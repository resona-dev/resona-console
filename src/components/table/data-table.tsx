"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { DataTablePagination } from "./pagination-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableToolbar } from "./data-table-toolbar";
import { FacetedFilterOption } from "./faceted-filter";

export interface DataTableConfig {
  filters?: {
    accessorKey: string;
    title: string;
    options: FacetedFilterOption[];
  }[];
  initialSort?: SortingState;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  config?: DataTableConfig;
  data: TData[];
  onRowClick?: (row: TData) => void;
  isLoading: boolean;
  refetch?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  isLoading,
  config,
  refetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    config?.initialSort ?? []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filters={config?.filters}
        refetch={refetch}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer [&[aria-expanded=true]_svg.chevron]:rotate-180"
                  onClick={(event) => {
                    onRowClick?.(row.original);
                    table.resetRowSelection();
                    row.toggleSelected();
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              [
                Array.from(Array(5).keys()).map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columns.length} className="px-0">
                      <Skeleton className="h-8 rounded-none" />
                    </TableCell>
                  </TableRow>
                )),
              ]
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No Jobs scheduled
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
