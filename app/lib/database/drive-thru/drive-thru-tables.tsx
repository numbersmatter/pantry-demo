import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";


interface DriveThruFormCols {
  staff_id: string;
  staff_name: string;
  created_date: string;
  form_id: string;
}

export const driveThruTable: ColumnDef<DriveThruFormCols>[] = [

  {
    accessorKey: "staff_name",
    header: "Staff Name",
  },
  {
    accessorKey: "created_date",
    header: "Created Date",
    cell: ({ row }) => {
      return (
        <span>{row.original.created_date}</span>
      )
    }
  },
  {
    accessorKey: "form_id",
    header: "Form ID",
    cell: ({ row }) => {
      return (
        <Link to={`/drive-thru/${row.original.form_id}`}>Link</Link>
      )
    }
  }


]