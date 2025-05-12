import type { ColumnDef, Row } from "@tanstack/react-table"

// Update the createFilterableColumn function to use DataTableColumnHeader
import { DataTableColumnHeader } from "./data-table-column-header"

// Filter functions
export const filterFns = {
  // Text filter (includes any of the selected values)
  text: (row: Row<any>, columnId: string, filterValue: string[]) => {
    const value = row.getValue(columnId) as string
    return filterValue.includes(value)
  },

  // Date filter (between from and to dates)
  date: (row: Row<any>, columnId: string, filterValue: [Date, Date]) => {
    const value = row.getValue(columnId) as Date
    const [from, to] = filterValue

    // Convert string dates to Date objects if needed
    const dateValue = value instanceof Date ? value : new Date(value)

    // Set time to midnight for accurate date comparison
    const fromDate = new Date(from)
    fromDate.setHours(0, 0, 0, 0)

    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)

    return dateValue >= fromDate && dateValue <= toDate
  },

  // Number filter (between min and max)
  number: (row: Row<any>, columnId: string, filterValue: [number, number]) => {
    const value = row.getValue(columnId) as number
    const [min, max] = filterValue

    return value >= min && value <= max
  },
}

// Helper to create column definitions with filter support
export function createFilterableColumn<TData, TValue>(
  columnConfig: Partial<ColumnDef<TData, TValue>> & {
    accessorKey: string
    header: string
    filterType?: "text" | "date" | "number"
  },
): ColumnDef<TData, TValue> {
  const { accessorKey, header, filterType = "text", ...rest } = columnConfig

  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={header} />,
    enableSorting: true,
    enableHiding: true,
    enableColumnFilter: true,
    filterFn: filterFns[filterType],
    meta: {
      filterType,
    },
    ...rest,
  }
}
