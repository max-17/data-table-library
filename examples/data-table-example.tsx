"use client"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"
import { createFilterableColumn } from "@/components/data-table/data-table-utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Example data type
interface Payment {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  createdAt: Date
}

// Sample data
const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "8a6d7fde",
    amount: 250,
    status: "success",
    email: "test@example.com",
    createdAt: new Date("2023-02-01"),
  },
  {
    id: "a624d78c",
    amount: 75,
    status: "failed",
    email: "another@test.com",
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "b8e9f21a",
    amount: 300,
    status: "success",
    email: "success@example.com",
    createdAt: new Date("2023-03-01"),
  },
]

export default function DataTableExample() {
  // Update the columns definition to ensure filters are enabled
  const columns: ColumnDef<Payment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    createFilterableColumn({
      accessorKey: "status",
      header: "Status",
      filterType: "text",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "success"
                ? "success"
                : status === "processing"
                  ? "outline"
                  : status === "pending"
                    ? "secondary"
                    : "destructive"
            }
          >
            {status}
          </Badge>
        )
      },
    }),
    createFilterableColumn({
      accessorKey: "email",
      header: "Email",
      filterType: "text",
    }),
    createFilterableColumn({
      accessorKey: "amount",
      header: "Amount",
      filterType: "number",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return formatted
      },
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

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} searchColumn="email" />
    </div>
  )
}
