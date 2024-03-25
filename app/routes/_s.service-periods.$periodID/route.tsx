import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Fragment } from 'react'
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { ContainerPadded } from "~/components/common/containers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { ServicePeriodHeader, ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { RouteError, StandardError } from "~/components/common/ErrorPages";
import { servicePeriodsDb } from "~/lib/database/service-periods/service-periods-crud.server";

const tabs = [
  { name: 'Applied', href: '#', current: false },
  { name: 'Phone Screening', href: '#', current: false },
  { name: 'Interview', href: '#', current: true },
  { name: 'Offer', href: '#', current: false },
  { name: 'Hired', href: '#', current: false },
]





export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const servicePeriodID = params.periodID ?? "periodID";

  const servicePeriod = await servicePeriodsDb.read(servicePeriodID);
  if (!servicePeriod) {
    throw new Response("Service Period not found", { status: 404 });
  }

  const headerData = {
    programName: "Food Box Delivery",
    servicePeriodName: servicePeriod.name,
    programAreaName: "CIS - Food Pantry"
  }

  return json({ user, headerData });
};

export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <ContainerPadded>
        <ServicePeriodHeader
          programName={data.headerData.programName}
          servicePeriodName={data.headerData.servicePeriodName}
          programAreaName={data.headerData.programAreaName}
        />

        <Outlet />
      </ContainerPadded>
    </>
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