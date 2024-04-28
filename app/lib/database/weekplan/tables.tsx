import { ColumnDef } from "@tanstack/react-table";
import { WeekPlan } from "./types";
import { Link } from "@remix-run/react";


export const weekPlanColumns: ColumnDef<WeekPlan>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      return (
        <Link to={`/weekplan/${row.original.id}`}>
          View
        </Link>
      )
    }
  }
]



