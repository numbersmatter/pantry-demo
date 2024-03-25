import { Link } from "@remix-run/react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { Checkbox } from "~/components/shadcn/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/shadcn/ui/table"

interface SeatTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
}


interface ServicePeriodSeatsCols {
  id: string;
  family_name: string;
  enrolled_date: Date;
  number_of_members: number;
};


const selectSeats: ColumnDef<ServicePeriodSeatsCols>[] =
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


interface SeatRow {
  id: string;
  family_name: string;
  enrolled_date: Date;
  number_of_members: number;
}


export function SelectSeatsTable({
  data,
}: { data: SeatRow[] }) {
  const initState = {
    "04QF8AHiM30cCBy58fq2": true,
    "1HL0UeVjj6t80OepEa5n": true,
  }
  const [rowSelection, setRowSelection] = useState({})




  const table = useReactTable({
    data,
    getRowId: (row) => row.id,
    columns: selectSeats,
    state: {
      rowSelection,
    },
    // initialState:initState,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <SelectableTableComp table={table} columns={selectSeats} />
      <pre>
        {JSON.stringify(table.getSelectedRowModel(), null, 2)}
      </pre>
    </div>
  )
}

export function SelectableTableComp<TData, TValue>({
  columns,
  table
}: { table: TableType<TData>, columns: ColumnDef<TData, TValue>[] }) {
  return <div className="space-y-4">

    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    {/* <DataTablePagination table={table} /> */}
  </div>
}

