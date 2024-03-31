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

import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { z } from "zod";
import { seatsOfServicePeriod } from "~/lib/database/seats/seats-tables";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { makeDomainFunction } from "domain-functions";
import { ServiceListId } from "~/lib/database/service-lists/types";
import { performMutation } from "remix-forms";
import { AddSeatBox, SeatBox } from "~/components/pages/service-lists/add-seat-box";





export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID"
  const serviceList = await serviceListsDb.read(listID);

  if (!serviceList) {
    throw new Response("Service List not found", { status: 404 });
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

  const baseUrl = `/service-lists/${listID}/update`
  const actionUrl = `/service-lists/${listID}/preparing/seats`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: "complete" },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'current' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  return json({ user, steps, seatsStatus, actionUrl, serviceList });
};



export default function Route() {
  const { steps, seatsStatus, actionUrl, serviceList } = useLoaderData<typeof loader>();


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

