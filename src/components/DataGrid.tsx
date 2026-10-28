"use client";

import React, { useRef, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Stock } from "@/types/stock";
import { formatCurrency, formatNumberIndian } from "@/lib/formatters";

const columnHelper = createColumnHelper<Stock>();

interface DataGridProps {
  data: Stock[];
}

export default function DataGrid({ data }: DataGridProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Column Definitions
  const columns = useMemo(
    () => [
      columnHelper.accessor("symbol", {
        header: "Symbol",
        cell: (info) => (
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
            {info.getValue()}
          </span>
        ),
        size: 90,
      }),
      columnHelper.accessor("companyName", {
        header: "Company",
        cell: (info) => (
          <span className="truncate max-w-[110px] sm:max-w-[180px] block text-xs sm:text-sm">
            {info.getValue()}
          </span>
        ),
        size: 130,
      }),
      columnHelper.accessor("lastPrice", {
        header: "LTP (₹)",
        cell: (info) => (
          <span className="font-mono text-xs sm:text-sm">{formatCurrency(info.getValue())}</span>
        ),
        size: 100,
      }),
      columnHelper.accessor("changePercent", {
        header: "Change (%)",
        cell: (info) => {
          const val = info.getValue();
          const isPositive = val >= 0;
          return (
            <span
              className={`font-mono font-semibold text-xs sm:text-sm ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? `+${val}%` : `${val}%`}
            </span>
          );
        },
        size: 100,
      }),
      columnHelper.accessor("marketCap", {
        header: "Market Cap",
        cell: (info) => (
          <span className="font-mono text-xs sm:text-sm">
            ₹{formatNumberIndian(info.getValue())}
          </span>
        ),
        size: 120,
      }),
      columnHelper.accessor("pe", {
        header: "P/E",
        cell: (info) => (
          <span className="font-mono text-xs sm:text-sm">
            {info.getValue() ?? "N/A"}
          </span>
        ),
        size: 80,
      }),
      columnHelper.accessor("sector", {
        header: "Sector",
        cell: (info) => (
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {info.getValue()}
          </span>
        ),
        size: 110,
      }),
      columnHelper.accessor("volume", {
        header: "Volume",
        cell: (info) => (
          <span className="font-mono text-xs sm:text-sm">
            {formatNumberIndian(info.getValue())}
          </span>
        ),
        size: 100,
      }),
    ],
    []
  );

  // Helper to apply responsive hidden classes to th and td based on column id
  const getResponsiveClass = (columnId: string) => {
    switch (columnId) {
      case "marketCap":
        return "hidden sm:flex";
      case "pe":
      case "sector":
        return "hidden md:flex";
      case "volume":
        return "hidden lg:flex";
      default:
        return "flex";
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  // TanStack Virtualizer Configuration
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 38,
    overscan: 10,
  });

  return (
    <div className="w-full max-w-full border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
      <div className="p-2.5 sm:p-3 border-b text-xs sm:text-sm font-semibold flex justify-between items-center bg-gray-50 dark:bg-gray-800">
        <span>Stock Screener Grid</span>
        <span className="text-[11px] sm:text-xs text-gray-500 font-mono">
          Total Loaded: {rows.length.toLocaleString()} stocks
        </span>
      </div>

      {/* Responsive Container */}
      <div
        ref={tableContainerRef}
        className="h-[420px] sm:h-[600px] overflow-auto relative w-full overflow-x-auto [webkit-overflow-scrolling:touch]"
      >
        <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-full md:min-w-[900px]">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10 shadow-sm text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  const responsiveClass = getResponsiveClass(header.column.id);
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`p-2 sm:p-2.5 font-semibold cursor-pointer select-none border-b border-gray-200 dark:border-gray-700 items-center shrink-0 ${responsiveClass}`}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      <div className="flex items-center gap-1 truncate">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
              display: "block",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="hover:bg-blue-50/50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/40 transition-colors flex items-center"
                >
                  {row.getVisibleCells().map((cell) => {
                    const responsiveClass = getResponsiveClass(cell.column.id);
                    return (
                      <td
                        key={cell.id}
                        className={`px-2 sm:px-2.5 truncate shrink-0 items-center ${responsiveClass}`}
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}