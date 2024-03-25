import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { ItemLine } from "~/lib/value-estimation/types/item-estimations";
import { Button } from "~/components/shadcn/ui/button";
import { SingleButtonForm } from "~/components/common/single-button-form";
import { dollarValueConverter } from "~/lib/value-estimation/utils";

interface ServiceListIndexCols {
  id: string;
  name: string;
  description: string;
}

// export interface ItemLine {
//   item_name: string;
//   type: ItemTypes;
//   quantity: number;
//   value: number;
//   item_id: string;
// }

export const serviceListItemsCols: ColumnDef<ItemLine>[] = [
  {
    accessorKey: "item_name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const dollarValue = dollarValueConverter(row.original.value)
      return (
        <span>{dollarValue}</span>
      )
    }
  },
  {
    id: "item_id",
    accessorKey: "item_id",
    header: "Remove Item",
    cell: ({ row }) => {
      return (
        <SingleButtonForm text="Remove Item">
          <input type="hidden" readOnly name="item_id" value={row.original.item_id} />
          <input type="hidden" readOnly name="item_name" value={row.original.item_name} />
          <input type="hidden" readOnly name="quantity" value={row.original.quantity} />
          <input type="hidden" readOnly name="value" value={row.original.value} />
          <input type="hidden" readOnly name="actionType" value="removeItem" />
        </SingleButtonForm>
      )
    }
  }

]


export const serviceListIndexCols: ColumnDef<ServiceListIndexCols>[] = [
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
        <Link to={`${row.original.id}`}>Go to List</Link>
      )
    }
  }
]


