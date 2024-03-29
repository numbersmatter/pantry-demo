import type { ActionFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { RouteError, StandardError } from "~/components/common/ErrorPages";
import { ContainerPadded } from "~/components/common/containers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";



const schema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(0).max(100),
  status: z.enum(["active", "inactive"]),
})

const createMutation = makeDomainFunction(schema)(async (values) => {
  const program_area_id = await db.program_areas.create({
    ...values,
  })
  return { status: "success", program_area_id }
})

export default function RouteComponent() {
  return (
    <ContainerPadded>
      <ProgramAreaHeader />
      <Outlet />
    </ContainerPadded>
  );
}


export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const cloneRequest = request.clone();
  const formData = await cloneRequest.formData();
  const type = formData.get("type");




  return {};
};


function ProgramAreaHeader() {
  return (
    <div className="py-5 md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Program Areas
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          type="button"
          className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add
        </button>
      </div>
    </div>
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

