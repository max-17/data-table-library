"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TextFilter } from "./filters/text-filter"
import { DateFilter } from "./filters/date-filter"
import { NumberFilter } from "./filters/number-filter"

interface DataTableFilterPopoverProps<TData, TValue> {
  column: Column<TData, TValue>
  children: React.ReactNode
}

export function DataTableFilterPopover<TData, TValue>({
  column,
  children,
}: DataTableFilterPopoverProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false)
  const [filterValue, setFilterValue] = React.useState<any>(column.getFilterValue())

  // Update local state when column filter value changes
  React.useEffect(() => {
    setFilterValue(column.getFilterValue())
  }, [column.getFilterValue()])

  // Determine filter type based on column meta
  const filterType = column.columnDef.meta?.filterType || "text"

  // Set width based on filter type
  const getPopoverWidth = () => {
    switch (filterType) {
      case "date":
        return "w-auto min-w-[500px]"
      case "number":
        return "w-[220px]"
      default:
        return "w-[220px]"
    }
  }

  const handleApply = () => {
    column.setFilterValue(filterValue)
    setOpen(false)
  }

  const handleReset = () => {
    setFilterValue(undefined)
    column.setFilterValue(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={`${getPopoverWidth()} p-0`} align="end">
        <div className="p-2 grid gap-2">
          {filterType === "text" && <TextFilter column={column} value={filterValue} onChange={setFilterValue} />}
          {filterType === "date" && <DateFilter column={column} value={filterValue} onChange={setFilterValue} />}
          {filterType === "number" && <NumberFilter column={column} value={filterValue} onChange={setFilterValue} />}
        </div>
        <div className="flex items-center justify-between p-2 border-t">
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={!column.getIsFiltered()}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button size="sm" onClick={handleApply}>
            <Check className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
