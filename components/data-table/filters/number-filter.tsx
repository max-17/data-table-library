"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  value: [number, number] | undefined
  onChange: (value: [number, number] | undefined) => void
}

export function NumberFilter<TData, TValue>({ column, value, onChange }: NumberFilterProps<TData, TValue>) {
  const [min, setMin] = React.useState<string>(value?.[0]?.toString() || "")
  const [max, setMax] = React.useState<string>(value?.[1]?.toString() || "")

  // Update filter when min or max changes
  React.useEffect(() => {
    const numericMin = min === "" ? undefined : Number(min)
    const numericMax = max === "" ? undefined : Number(max)

    if (numericMin !== undefined || numericMax !== undefined) {
      onChange([
        numericMin !== undefined ? numericMin : Number.NEGATIVE_INFINITY,
        numericMax !== undefined ? numericMax : Number.POSITIVE_INFINITY,
      ])
    } else {
      onChange(undefined)
    }
  }, [min, max, onChange])

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <Label htmlFor="min">Minimum</Label>
        <Input
          id="min"
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          placeholder="Min"
          className="h-8"
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="max">Maximum</Label>
        <Input
          id="max"
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          placeholder="Max"
          className="h-8"
        />
      </div>
    </div>
  )
}
