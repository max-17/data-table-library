"use client"

import { Input } from "@/components/ui/input"
import { useDataTable } from "./data-table-context"
import { DataTableViewOptions } from "./data-table-view-options"

export function DataTableToolbar() {
  const { globalFilter, setGlobalFilter } = useDataTable()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-9 w-[250px]"
        />
      </div>
      <DataTableViewOptions />
    </div>
  )
}
