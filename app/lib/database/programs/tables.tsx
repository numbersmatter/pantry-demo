import { ColumnDef } from "@tanstack/react-table";
import { Program } from "./types";
import { Link } from "@remix-run/react";
import { SingleButtonFetcher } from "~/components/common/single-button-form";



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
        <SingleButtonFetcher
          text="View"
          actionUrl={`/programs/${row.original.id}`}
        >
          <input type="hidden" name="programID" value={row.original.id} />
          <input type="hidden" name="_action" value="goToPeriod" />

        </SingleButtonFetcher>
      )
    }
  }
]





