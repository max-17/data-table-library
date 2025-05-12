"use client"

import type { Column } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Calendar, Calculator } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTableFilterPopover } from "./data-table-filter-popover"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const hasFilter = column.getCanFilter()
  const isFiltered = column.getIsFiltered()
  const filterType = column.columnDef.meta?.filterType || "text"

  // Choose the appropriate filter icon based on filter type
  const FilterIcon = () => {
    switch (filterType) {
      case "date":
        return <Calendar className="h-4 w-4" />
      case "number":
        return <Calculator className="h-4 w-4" />
      default:
        return <Filter className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center">
        <span>{title}</span>
        {column.getCanSort() && (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4 ml-1" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4 ml-1" />
            ) : (
              <ArrowUpDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        )}
      </div>
      {hasFilter && (
        <DataTableFilterPopover column={column}>
          <Button
            variant="ghost"
            size="sm"
            className={cn("-mr-3 h-8", isFiltered ? "bg-primary/20" : "hover:bg-accent")}
          >
            <FilterIcon />
          </Button>
        </DataTableFilterPopover>
      )}
    </div>
  )
}
