import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { ServicePeriod } from "./types/service-periods-model";

interface ServicePeriodCols {
  id: string;
  name: string;
  description: string;

}


export const servicePeriodsOfProgramColumns: ColumnDef<ServicePeriodCols>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
        <Link to={`/service-periods/${row.original.id}`}>Link</Link>
      )
    }
  }
]


