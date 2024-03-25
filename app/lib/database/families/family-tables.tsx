import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";




export interface FamilyTablesCol {
  id: string;
  family_name: string;
  created_date: string;

}

export const FamilyIndexTable: ColumnDef<FamilyTablesCol>[] = [
  {
    accessorKey: "family_name",
    header: "Family Name",
  },
  {
    accessorKey: "created_date",
    header: "Created Date",
  },
  {
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      return (
        <Link to={`/families/${row.original.id}`}>Link</Link>
      )
    }
  }
];







