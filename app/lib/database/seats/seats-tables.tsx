import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { IndeterminateCheckbox } from "~/components/common/indeterminate-checkbox";
import { useMemo } from "react";
import { Checkbox } from "~/components/shadcn/ui/checkbox";
import { Seat } from "./types/seats-model";
import { Button } from "~/components/shadcn/ui/button";

interface ServicePeriodSeatsCols {
  id: string;
  family_name: string;
  enrolled_date: Date;
  number_of_members: number;
};


export const seatsOfServiceList: ColumnDef<Seat>[] =
  [
    {
      accessorKey: "family_name",
      header: "Name",
    },
    {
      accessorKey: "enrolled_date",
      header: "Enrollment Date",
      cell: ({ row }) => {
        return (
          <span>{row.original.enrolled_date.toLocaleDateString()}</span>
        )
      }
    },
    {
      accessorKey: "street",
      header: "Street",
      cell: ({ row }) => {
        return (
          <span>{row.original.address.street}</span>
        )
      }
    },
    {
      id: "id",
      accessorKey: "id",
      header: "Remove",
      cell: ({ row }) => {
        return (
          <Button variant={"destructive"} >Remove</Button>
        )
      }
    }
  ]


export const seatsOfServicePeriod: ColumnDef<ServicePeriodSeatsCols>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "family_name",
      header: "Name",
    },
    {
      accessorKey: "enrolled_date",
      header: "Enrollment Date",
    },
    {
      id: "id",
      accessorKey: "id",
      header: "Link",
      cell: ({ row }) => {
        return (
          <Link to={`${row.original.id}`}>Link</Link>
        )
      }
    }
  ]
