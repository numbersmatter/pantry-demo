import { ColumnDef } from "@tanstack/react-table";
import { Program } from "./types";
import { Link } from "@remix-run/react";



export type ProgramAreas_ProgramTable = {
  id: string
  name: string
}


export const programsOfAreaColumns: ColumnDef<Program>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "program_area",
    header: "Program Area",
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      return (
        <Link to={`/programs/${row.original.id}`}>Link</Link>
      )
    }
  }
]


