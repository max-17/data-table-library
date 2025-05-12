"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"

interface DataTableContextProps {
  table: Table<any>
  searchColumn?: string
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export const DataTableContext = React.createContext<DataTableContextProps | undefined>(undefined)

export function useDataTable() {
  const context = React.useContext(DataTableContext)
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider")
  }
  return context
}
