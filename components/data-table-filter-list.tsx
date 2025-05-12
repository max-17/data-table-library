"use client"
import type { Table } from "@tanstack/react-table"
import { X, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDataTable } from "./data-table-context"

interface DataTableFilterListProps {
  table: Table<any>
}

export function DataTableFilterList({ table }: DataTableFilterListProps) {
  const { globalFilter, setGlobalFilter } = useDataTable()
  const columnFilters = table.getState().columnFilters

  // Check if there are any filters applied
  const hasFilters = columnFilters.length > 0 || globalFilter !== ""

  if (!hasFilters) return null

  // Format filter value for display
  const formatFilterValue = (columnId: string, value: any) => {
    const column = table.getColumn(columnId)
    if (!column) return String(value)

    const filterType = column.columnDef.meta?.filterType

    if (filterType === "date" && Array.isArray(value)) {
      const [from, to] = value.map((date) => new Date(date))
      if (from.getTime() === to.getTime()) {
        return `${from.toLocaleDateString()}`
      }
      return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
    }

    if (filterType === "number" && Array.isArray(value)) {
      const [min, max] = value
      if (min === Number.NEGATIVE_INFINITY) {
        return `≤ ${max}`
      }
      if (max === Number.POSITIVE_INFINITY) {
        return `≥ ${min}`
      }
      return `${min} - ${max}`
    }

    if (Array.isArray(value)) {
      return value.join(", ")
    }

    return String(value)
  }

  // Get column header text
  const getColumnName = (columnId: string) => {
    const column = table.getColumn(columnId)
    if (!column) return columnId

    // Try to extract the title from the header
    const headerDef = column.columnDef.header
    if (typeof headerDef === "string") return headerDef

    // Fallback to column ID with capitalization
    return columnId.charAt(0).toUpperCase() + columnId.slice(1)
  }

  return (
    <div className="flex flex-wrap gap-2 py-2">
      <div className="text-sm text-muted-foreground mr-2 pt-1">Active filters:</div>

      {/* Global search filter */}
      {globalFilter && (
        <Badge variant="secondary" className="h-7 px-2 text-sm">
          <Search className="mr-1 h-3 w-3" />
          <span className="mr-1">Search:</span>
          {globalFilter}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 -mr-2 h-4 w-4 p-0 hover:bg-muted"
            onClick={() => setGlobalFilter("")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove search filter</span>
          </Button>
        </Badge>
      )}

      {/* Column filters */}
      {columnFilters.map((filter) => (
        <Badge key={filter.id} variant="secondary" className="h-7 px-2 text-sm">
          <span className="mr-1">{getColumnName(filter.id)}:</span>
          {formatFilterValue(filter.id, filter.value)}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 -mr-2 h-4 w-4 p-0 hover:bg-muted"
            onClick={() => table.getColumn(filter.id)?.setFilterValue(undefined)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}

      {/* Clear all filters button */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-sm"
          onClick={() => {
            table.resetColumnFilters()
            setGlobalFilter("")
          }}
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
