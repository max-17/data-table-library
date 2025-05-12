"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { CheckSquare, Square, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"

interface TextFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  value: string[] | undefined
  onChange: (value: string[] | undefined) => void
}

export function TextFilter<TData, TValue>({ column, value, onChange }: TextFilterProps<TData, TValue>) {
  const facets = column.getFacetedUniqueValues()
  const options = React.useMemo(() => {
    return Array.from(facets.keys()).sort()
  }, [facets])

  const selectedValues = value || []

  const handleSelect = (currentValue: string) => {
    const newSelectedValues = selectedValues.includes(currentValue)
      ? selectedValues.filter((val) => val !== currentValue)
      : [...selectedValues, currentValue]

    onChange(newSelectedValues.length ? newSelectedValues : undefined)
  }

  const handleSelectAll = () => {
    onChange(selectedValues.length === options.length ? undefined : options)
  }

  return (
    <Command className="border-none p-0">
      <CommandInput placeholder="Search values..." />
      <CommandList className="max-h-[200px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <div className="p-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSelectAll}>
              {selectedValues.length === options.length ? (
                <CheckSquare className="mr-2 h-4 w-4" />
              ) : (
                <Square className="mr-2 h-4 w-4" />
              )}
              Select All
            </Button>
          </div>
          <Separator />
          {options.map((option) => (
            <CommandItem key={String(option)} onSelect={() => handleSelect(String(option))} className="px-2 py-1">
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selectedValues.includes(String(option))
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible",
                )}
              >
                <Check className="h-4 w-4" />
              </div>
              <span>{String(option)}</span>
              {facets.get(option) && (
                <Badge variant="secondary" className="ml-auto">
                  {facets.get(option)}
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
