import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { Form, useLoaderData, } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card"

import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { z } from "zod";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { makeDomainFunction } from "domain-functions";
import { ServiceListId } from "~/lib/database/service-lists/types";
import { performMutation } from "remix-forms";
import { AddSeatBox } from "~/components/pages/service-lists/add-seat-box";
import { Button } from "~/components/shadcn/ui/button";
import { db } from "~/lib/database/firestore.server";


const seatMutSchema = z.object({
  seatID: z.string().length(20),
  actionType: z.enum(["addSeat", "removeSeat"])
})

const addAllSeatsSchema = z.object({
  actionType: z.enum(["addAllSeats"])
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

const addAllSeatsMutation = (listId: ServiceListId, service_period_id: string) => makeDomainFunction
  (addAllSeatsSchema)(
    async (values) => {
      const allSeats = await db.seats.queryByString("service_period_id", service_period_id);
      const seatIDs = allSeats.map((seat) => seat.id);

      const addWrites = await db.service_lists.update(listId, {
        seats_array: seatIDs
      });

      return {
        status: 200,
        message: "All Seats added"
      }


    })

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
  const actionUrl = `/service-lists/${listID}/preparing/seats`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: 'current' },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'upcoming' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  return json({ user, headerData, steps, seatsStatus, actionUrl });
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
  if (actionType === "addAllSeats") {
    const result = await performMutation({
      request,
      schema: addAllSeatsSchema,
      mutation: addAllSeatsMutation(listID, serviceList.service_period_id),
    });

    return result;
  }


  return json({ message: "No action performed" })
};


export default function Route() {
  const { steps, seatsStatus, actionUrl } = useLoaderData<typeof loader>();

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
            <Form method="post">
              <Button type="submit" name={"actionType"} value="addAllSeats" >Add all seats</Button>
            </Form>
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
                  <AddSeatBox actionUrl={actionUrl} key={seat.id} seat={data} />
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

