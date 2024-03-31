import { Form, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { DataTable } from "~/components/display/data-table";
import { serviceListItemsCols } from "~/lib/database/service-lists/tables";
import { FormDialogVer1 } from "~/components/common/form-dialog";
import { Label } from "~/components/shadcn/ui/label";
import { Input } from "~/components/shadcn/ui/input";
import { Button } from "~/components/shadcn/ui/button";
import { protectedRoute } from "~/lib/auth/auth.server";
import { ItemLine } from "~/lib/value-estimation/types/item-estimations";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const actionId = params.actionId ?? "actionId";

  const baseUrl = `/list-action/${actionId}`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: 'current' },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'upcoming' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  const service_items: ItemLine[] = [
    {
      item_id: "1",
      item_name: "Item 1",
      quantity: 2,
      value: 100,
      type: "individual-items"
    },
    {
      item_id: "2",
      item_name: "Item 2",
      quantity: 1,
      value: 200,
      type: "individual-items"
    },
  ]
  return json({ service_items, steps });
};



export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <ProgressPanels steps={data.steps} />
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            Add the menu items for this service list.
          </CardDescription>
        </CardHeader>
        <DataTable
          columns={serviceListItemsCols}
          data={data.service_items}
        />
        <CardFooter className="py-2">
          <FormDialogVer1>
            <Form method="post">
              <Card>
                <CardHeader>
                  <CardTitle>Other Item</CardTitle>
                  <CardDescription>
                    Add other item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="item_name">Name</Label>
                    <Input name="item_name" id="item_name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" type="number" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="value">Unit Value</Label>
                    <Input id="value" name="value" type="number" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button name="actionType" value="addItem" type="submit">Add Item</Button>
                </CardFooter>
              </Card>
            </Form>
          </FormDialogVer1>
        </CardFooter>
      </Card>


      <pre>{JSON.stringify({}, null, 2)} </pre>
    </>
  )
}

