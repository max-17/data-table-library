# Data Table Component Library

A comprehensive data table component library built with shadcn/ui and TanStack Table (React Table).

## Features

- Sorting functionality on columns
- Filtering for different data types (text, date, number)
- Ascending/Descending sorting
- Global search
- TypeScript compatible
- TanStack Table for core functionality
- Table State provider and hooks to avoid prop passing
- Column header with sort and filter indicators
- Pagination

## Components

### Core Components

- `DataTable`: The main table component
- `DataTableColumnHeader`: Header component with sorting and filtering
- `DataTableToolbar`: Toolbar with search and view options
- `DataTablePagination`: Pagination controls
- `DataTableContext`: Context provider for table state

### Filter Components

- `TextFilter`: Filter for text columns with checkbox list
- `DateFilter`: Filter for date columns with calendar and shortcuts
- `NumberFilter`: Filter for number columns with min/max inputs

## Usage

### Basic Example

\`\`\`tsx
import { DataTable } from "@/components/data-table/data-table"
import { createFilterableColumn } from "@/components/data-table/data-table-utils"

// Define your data type
interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

// Define your columns
const columns = [
  createFilterableColumn({
    accessorKey: "name",
    header: "Name",
    filterType: "text",
  }),
  createFilterableColumn({
    accessorKey: "email",
    header: "Email",
    filterType: "text",
  }),
  createFilterableColumn({
    accessorKey: "role",
    header: "Role",
    filterType: "text",
  }),
  createFilterableColumn({
    accessorKey: "createdAt",
    header: "Created At",
    filterType: "date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return date.toLocaleDateString()
    },
  }),
]

// Render the table
export default function UsersTable({ data }: { data: User[] }) {
  return <DataTable columns={columns} data={data} searchColumn="email" />
}
\`\`\`

### Custom Column Rendering

You can customize how columns are rendered by providing a `cell` function:

\`\`\`tsx
createFilterableColumn({
  accessorKey: "status",
  header: "Status",
  filterType: "text",
  cell: ({ row }) => {
    const status = row.getValue("status") as string
    return (
      <Badge variant={status === "active" ? "success" : "destructive"}>
        {status}
      </Badge>
    )
  },
})
\`\`\`

### Custom Filtering

You can add custom filter functions by extending the `filterFns` object in `data-table-utils.ts`.

## Extending

This library is designed to be extensible. You can:

1. Add new filter types
2. Customize the appearance of filters
3. Add additional table features
4. Implement custom cell renderers

## Requirements

- React 18+
- Next.js 13+ (for server components)
- shadcn/ui components
- TanStack Table v8
