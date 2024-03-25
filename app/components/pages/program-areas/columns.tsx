import { Link } from "@remix-run/react"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProgramAreasTableCol = {
  id: string
  name: string
  status: "active" | "inactive" | "planning"
  description: string
}

export const programAreaColumns: ColumnDef<ProgramAreasTableCol>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      return (
        <Link to={`/program-areas/${row.original.id}`}>Link</Link>
      )
    }
  }
]
