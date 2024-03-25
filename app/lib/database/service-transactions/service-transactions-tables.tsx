import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { SingleButtonForm } from "~/components/common/single-button-form";

export type ServiceTransactionCols = {
  delivered_to: string;
  status: string;
  id: string;
  created_date: string;
};

export const serviceTransactionColumns: ColumnDef<ServiceTransactionCols>[] = [
  {
    accessorKey: "delivered_to",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_date",
    header: "Date Created",
    cell: ({ row }) => {
      return <p>{new Date(row.original.created_date).toLocaleDateString()}</p>;
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      const id = row.original.id;
      return <Link to={`${id}`}>{id}</Link>;
    },
  },
];
export const servicesOnSeat: ColumnDef<ServiceTransactionCols>[] = [
  {
    accessorKey: "delivered_to",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_date",
    header: "Date Created",
    cell: ({ row }) => {
      return <p>{new Date(row.original.created_date).toLocaleDateString()}</p>;
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      const id = row.original.id;
      return <SingleButtonForm text="View" > <input name="serviceID" hidden readOnly value={id} /> </SingleButtonForm>;
    },
  },
];



