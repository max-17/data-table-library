"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  value: [Date, Date] | undefined
  onChange: (value: [Date, Date] | undefined) => void
}

export function DateFilter<TData, TValue>({ column, value, onChange }: DateFilterProps<TData, TValue>) {
  // Initialize dateRange from column filter value
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: value ? value[0] : undefined,
    to: value ? value[1] : undefined,
  })

  // Update local state when column filter value changes
  React.useEffect(() => {
    const columnValue = column.getFilterValue() as [Date, Date] | undefined
    if (columnValue) {
      setDateRange({
        from: new Date(columnValue[0]),
        to: new Date(columnValue[1]),
      })
    } else {
      setDateRange({ from: undefined, to: undefined })
    }
  }, [column.getFilterValue()])

  // Format date for input field
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "yyyy-MM-dd")
  }

  // Parse date from input field
  const handleFromDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value
    if (inputDate) {
      const newDate = new Date(inputDate)
      if (!isNaN(newDate.getTime())) {
        const newRange = { ...dateRange, from: newDate }
        setDateRange(newRange)
        if (newRange.to) {
          onChange([newRange.from, newRange.to])
        } else if (newRange.from) {
          onChange([newRange.from, newRange.from])
        }
      }
    } else {
      setDateRange({ ...dateRange, from: undefined })
      if (dateRange.to) {
        onChange([dateRange.to, dateRange.to])
      } else {
        onChange(undefined)
      }
    }
  }

  const handleToDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value
    if (inputDate) {
      const newDate = new Date(inputDate)
      if (!isNaN(newDate.getTime())) {
        const newRange = { ...dateRange, to: newDate }
        setDateRange(newRange)
        if (newRange.from) {
          onChange([newRange.from, newRange.to])
        } else if (newRange.to) {
          onChange([newRange.to, newRange.to])
        }
      }
    } else {
      setDateRange({ ...dateRange, to: undefined })
      if (dateRange.from) {
        onChange([dateRange.from, dateRange.from])
      } else {
        onChange(undefined)
      }
    }
  }

  const handleDateRangeSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)

    // If only one date is selected, use it as both start and end
    if (range.from && !range.to) {
      onChange([range.from, range.from])
    }
    // If both dates are selected, use them as range
    else if (range.from && range.to) {
      onChange([range.from, range.to])
    }
    // If no dates are selected, clear the filter
    else {
      onChange(undefined)
    }
  }

  const handleThisMonth = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    setDateRange({ from: firstDayOfMonth, to: lastDayOfMonth })
    onChange([firstDayOfMonth, lastDayOfMonth])
  }

  const handlePreviousMonth = () => {
    const today = new Date()
    const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    setDateRange({ from: firstDayOfPrevMonth, to: lastDayOfPrevMonth })
    onChange([firstDayOfPrevMonth, lastDayOfPrevMonth])
  }

  return (
    <div className="space-y-4 p-1">
      {/* Manual date input fields */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="from-date" className="text-xs">
            From Date
          </Label>
          <Input
            id="from-date"
            type="date"
            value={formatDateForInput(dateRange.from)}
            onChange={handleFromDateInput}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="to-date" className="text-xs">
            To Date
          </Label>
          <Input
            id="to-date"
            type="date"
            value={formatDateForInput(dateRange.to)}
            onChange={handleToDateInput}
            className="h-8"
          />
        </div>
      </div>

      {/* Shortcut buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="w-full" onClick={handleThisMonth}>
          This Month
        </Button>
        <Button variant="outline" size="sm" className="w-full" onClick={handlePreviousMonth}>
          Previous Month
        </Button>
      </div>

      {/* Calendar */}
      <div className="pt-2">
        <Calendar mode="range" selected={dateRange} onSelect={handleDateRangeSelect} numberOfMonths={2} initialFocus />
      </div>
    </div>
  )
}
