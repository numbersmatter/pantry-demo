import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { Form, isRouteErrorResponse, Outlet, useActionData, useFetcher, useLoaderData, useRouteError } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card"

import { RouteError, StandardError } from "~/components/common/ErrorPages";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { FoodBoxOrder } from "~/lib/database/food-box-order/types/food-box-order-model";
import { DataTable } from "~/components/display/data-table";
import { z } from "zod";
import { seatsOfServicePeriod } from "~/lib/database/seats/seats-tables";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { SelectSeatsTable } from "~/components/pages/service-lists/seats-table";
import { Button } from "~/components/shadcn/ui/button";
import { makeDomainFunction } from "domain-functions";
import { ServiceListId } from "~/lib/database/service-lists/types";
import { performMutation } from "remix-forms";

const schema = z.object({
  item_name: z.string(),
  quantity: z.number(),
  value: z.number(),
})

const seatMutSchema = z.object({
  seatID: z.string().length(20),
  actionType: z.enum(["addSeat", "removeSeat"])
})

const addMutation = (listId: ServiceListId) => makeDomainFunction(seatMutSchema)(
  async ({ seatID }) => {
    const seat = await seatsDb.read(seatID);
    if (!seat) {
      return {
        status: 404,
        message: "Seat not found"
      }
    }

    await serviceListsDb.addSeat(listId, seatID);

    return {
      status: 200,
      message: "Seat added"
    }

  }
)
const removeMutation = (listId: ServiceListId) => makeDomainFunction(seatMutSchema)(
  async ({ seatID }) => {
    const seat = await seatsDb.read(seatID);
    if (!seat) {
      return {
        status: 404,
        message: "Seat not found"
      }
    }

    await serviceListsDb.removeSeat(listId, seatID);

    return {
      status: 200,
      message: "Seat removed"
    }

  }
)

interface SeatBox {
  family_name: string;
  enrolled_date: Date;
  number_of_members: number;
  id: string;
  status: "added" | "notAdded"

}


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID"
  const serviceList = await serviceListsDb.read(listID);

  if (!serviceList) {
    throw new Response("Service List not found", { status: 404 });
  }
  if (serviceList.status === "applied") {
    return redirect(`/service-lists/${listID}`)
  }

  const headerData = {
    programName: "Service List",
    servicePeriodName: "Spring 2024",
    programAreaName: "CIS - Food Pantry"
  }

  const allSeats = await seatsDb.queryByString("service_period_id", serviceList.service_period_id);

  const seatsStatus = allSeats.map((seat) => {
    return {
      id: seat.id,
      family_name: seat.family_name,
      enrolled_date: seat.enrolled_date,
      number_of_members: 1,
      status: serviceList.seats_array.includes(seat.id) ? "added" : "notAdded"
    } as SeatBox
  })

  const seatPromises = serviceList.seats_array.map((seat) => {
    const seatData = seatsDb.read(seat)
    return seatData
  });

  const seatReads = await Promise.all(seatPromises);

  const seats = seatReads
    .filter((seat) => seat !== undefined).map((seat) => seat!);

  const baseUrl = `/service-lists/${listID}/preparing`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: 'current' },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'upcoming' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  return json({ user, headerData, steps, seats, allSeats, seatsStatus });
};


export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID"
  const cloneRequest = request.clone();
  const formData = await cloneRequest.formData();
  const actionType = formData.get("actionType");

  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    throw new Response("Service List not found", { status: 404 });
  }

  if (!actionType) {
    throw new Response("Action Type not found", { status: 400 });
  }

  if (actionType === "addSeat") {
    const result = await performMutation({
      request,
      schema: seatMutSchema,
      mutation: addMutation(listID),
    });

    return result;
  }

  if (actionType === "removeSeat") {
    const result = await performMutation({
      request,
      schema: seatMutSchema,
      mutation: removeMutation(listID),
    });

    return result;
  }


  return json({ message: "No action performed" })
};


export default function Route() {
  const { steps, seats, allSeats, seatsStatus } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [rowSelection, setRowSelection] = useState<string[]>([]);

  const handleTabChange = (value: string) => {
    console.log("value", value)
  }

  const seatsData = allSeats.map((seat) => {
    const { unenrolled_date, ...rest } = seat
    return {
      ...rest,
      family_name: seat.family_name,
      enrolled_date: new Date(seat.enrolled_date),
      created_date: new Date(seat.created_date),
      updated_date: new Date(seat.updated_date),
      number_of_members: 1,
    }
  })

  const table = useReactTable({
    columns: seatsOfServicePeriod,
    data: seatsData,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })


  return (
    <>
      <ProgressPanels steps={steps} />
      <Card>
        <CardHeader>
          <CardTitle>Seat Selection</CardTitle>
          <div className="flex flex-row justify-between">
            <CardDescription>
              Select the seats for this service list.
            </CardDescription>

          </div>
        </CardHeader>
        <CardContent>
          <p>Seat Selection</p>
          <div className="flex flex-col gap-2">
            {
              seatsStatus.map((seat) => {

                const data = {
                  family_name: seat.family_name,
                  enrolled_date: new Date(seat.enrolled_date),
                  number_of_members: 1,
                  id: seat.id,
                  status: seat.status
                }
                return (
                  <AddSeatBox key={seat.id} seat={data} />
                )
              })

            }

          </div>
        </CardContent>
      </Card>
      <pre>{JSON.stringify({}, null, 2)} </pre>
    </>
  )
}

function AddSeatBox({ seat }: { seat: SeatBox }) {

  const fetcher = useFetcher();

  const fetching = fetcher.state !== "idle" ? true : false;

  const seatStatus = fetching ? "pending" : seat.status;

  const seatClasses: {
    "pending": string,
    "added": string,
    "notAdded": string
  } = {
    "pending": "bg-yellow-400",
    "added": "bg-green-400",
    "notAdded": ""
  }


  return (
    <Card className={seatClasses[seatStatus]}>
      <CardHeader>
        <CardTitle>{seat.family_name}</CardTitle>
        <CardDescription>
          {seat.enrolled_date.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {
          seatStatus === "added" && (
            <fetcher.Form method="post" className="flex flex-row gap-2">
              <input hidden readOnly name="actionType" value="removeSeat" />
              <input hidden readOnly name="seatID" value={seat.id} />
              <Button variant="destructive" type="submit">
                Remove Seat
              </Button>
            </fetcher.Form>
          )
        }
        {
          seatStatus === "notAdded" &&
          <fetcher.Form method="post" className="flex flex-row gap-2">
            <input hidden readOnly name="actionType" value="addSeat" />
            <input hidden readOnly name="seatID" value={seat.id} />
            <Button variant="secondary" type="submit">
              Add Seat
            </Button>
          </fetcher.Form>
        }

      </CardContent>
    </Card>
  )

}



export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    const test = error
    return <RouteError routeError={error} />
  }
  else if (error instanceof Error) {
    return (
      <StandardError error={error} />
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}