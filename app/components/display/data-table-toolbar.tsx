
import { Table } from "@tanstack/react-table"
import { Input } from "../shadcn/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "../shadcn/ui/button"
import { CrossIcon } from "lucide-react"
import { DataTableViewOptions } from "./data-table-view-options"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckBadgeIcon, CircleStackIcon, QuestionMarkCircleIcon, StopCircleIcon } from "@heroicons/react/20/solid"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircleIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleStackIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopCircleIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckBadgeIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossIcon,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <CrossIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}