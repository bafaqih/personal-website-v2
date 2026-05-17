"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/src/app/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  searchable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
}

/**
 * Reusable data table with search filtering and pagination.
 * Follows B&W minimalist design with subtle borders.
 */
export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  pageSize = 10,
  actions,
  emptyMessage = "No data found.",
  className,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filter data by search term across searchable columns
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    const searchableKeys = columns
      .filter((col) => col.searchable !== false)
      .map((col) => col.key);

    return data.filter((item) =>
      searchableKeys.some((key) => {
        const value = (item as Record<string, unknown>)[key];
        return String(value ?? "")
          .toLowerCase()
          .includes(term);
      })
    );
  }, [data, search, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <Table>
          <TableHeader className="bg-neutral-100/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-white/10">
            <TableRow className="hover:bg-transparent border-none">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-xs font-semibold! uppercase tracking-wider text-neutral-800 dark:text-neutral-200 py-3.5",
                    col.className
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-[100px] text-xs font-semibold! uppercase tracking-wider text-neutral-800 dark:text-neutral-200 py-3.5">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-b border-neutral-100 dark:border-white/5 last:border-none">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100 dark:bg-white/10" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="py-4">
                      <div className="h-8 w-8 animate-pulse rounded bg-neutral-100 dark:bg-white/10" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={(item as Record<string, unknown>).id as string ?? index}
                  className="transition-colors border-b border-neutral-100 dark:border-white/5 last:border-none even:bg-neutral-100/60 dark:even:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                >
                  {columns.map((col, colIndex) => {
                    const isPrimary = colIndex === 0 || (colIndex === 1 && (columns[0].key.includes("icon") || columns[0].key.includes("logo")));
                    return (
                      <TableCell
                        key={col.key}
                        className={cn(
                          "py-3.5 text-neutral-700 dark:text-neutral-300",
                          isPrimary && "font-medium text-neutral-950 dark:text-white",
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? "-")}
                      </TableCell>
                    );
                  })}
                  {actions && (
                    <TableCell className="py-3.5">{actions(item)}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
