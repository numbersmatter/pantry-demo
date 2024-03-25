import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, isRouteErrorResponse, useRouteError, json, Outlet } from "@remix-run/react";
import { StaffShell } from "~/components/shell/staff-shell";
import { authenticator, protectedRoute } from "~/lib/auth/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { user, staffData } = await protectedRoute(request);
  return json({ user, staffData });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export default function RouteComponent() {
  const data = useLoaderData<typeof loader>()


  return (
    <StaffShell staffData={data.staffData}>
      <div className="bg-slate-400 px-2 py-2 sm:px-2 md:py-2 lg:px-8">
        {/* Your content */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="text-lg font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
              CIS-T Staff Member
            </h4>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            {/* <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Publish
            </button> */}
          </div>
        </div>
      </div>
      {/* <div className="pb-7"> */}

      <Outlet />
      {/* </div> */}
      <footer className="bg-slate-400 px-2 py-2 sm:px-2 md:py-2 lg:px-8">
        {/* Your footer */}
        <div className="h-9" />
      </footer>
    </StaffShell>
  );
}
