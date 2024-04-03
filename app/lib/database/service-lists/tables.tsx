import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { ItemLine } from "~/lib/value-estimation/types/item-estimations";
import { Button } from "~/components/shadcn/ui/button";
import { SingleButtonFetcher, SingleButtonForm } from "~/components/common/single-button-form";
import { dollarValueConverter } from "~/lib/value-estimation/utils";

interface ServiceListIndexCols {
  id: string;
  name: string;
  description: string;
}

interface ServiceListActionsCols {
  created_date: string;
  records_created: number;
  records_updated: number;
  records_canceled: number;
  records_unchanged: number;
  id: string;
}

interface UpdateSeatsCols {
  seat_id: string;
  transactionId: string;
  current_value: number;
  new_value: number;
}

export const updateSeatsCols: ColumnDef<UpdateSeatsCols>[] = [
  {
    accessorKey: "seat_id",
    header: "Seat ID",
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "current_value",
    header: "Current Value",
    cell: ({ row }) => {
      const dollarValue = dollarValueConverter(row.original.current_value)
      return (
        <span>{dollarValue}</span>
      )
    }
  },
  {
    accessorKey: "new_value",
    header: "New Value",
    cell: ({ row }) => {
      const dollarValue = dollarValueConverter(row.original.new_value)
      return (
        <span>{dollarValue}</span>
      )
    }
  }
]



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
];


interface ItemLineList extends ItemLine {
  service_list_id: string;
}


export const serviceListItemsUpdateCol: ColumnDef<ItemLineList>[] = [
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
      const listID = row.original.service_list_id;
      const actionUrl = `/service-lists/${listID}/preparing?index`

      return (
        <SingleButtonFetcher actionUrl={actionUrl} text="Remove Item">
          <input type="hidden" readOnly name="item_id" value={row.original.item_id} />
          <input type="hidden" readOnly name="item_name" value={row.original.item_name} />
          <input type="hidden" readOnly name="quantity" value={row.original.quantity} />
          <input type="hidden" readOnly name="value" value={row.original.value} />
          <input type="hidden" readOnly name="actionType" value="removeItem" />
        </SingleButtonFetcher>
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
        <Link to={`/service-lists/${row.original.id}`}>Go to List</Link>
      )
    }
  }
]

export const serviceListActionsCols: ColumnDef<ServiceListActionsCols>[] = [
  {
    accessorKey: "created_date",
    header: "Created Date",
  },
  {
    accessorKey: "records_created",
    header: "Records Created",
  },
  {
    accessorKey: "records_updated",
    header: "Records Updated",
  },
  {
    accessorKey: "records_canceled",
    header: "Records Canceled",
  },
  {
    accessorKey: "records_unchanged",
    header: "Records Unchanged",
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Link",
    cell: ({ row }) => {
      return (
        <Link to={`/service-lists/${row.original.id}`}>Go to List</Link>
      )
    }
  }

]

