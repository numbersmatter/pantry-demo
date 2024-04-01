import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, isRouteErrorResponse, useRouteError, json, Outlet } from "@remix-run/react";
import { StaffShell } from "~/components/shell/staff-shell";
import { protectedRoute } from "~/lib/auth/auth.server";
import { basePath } from "~/lib/database/firestore.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { user, staffData } = await protectedRoute(request);

  const demo = basePath === "/"

  return json({ user, staffData, demo });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};



export default function RouteComponent() {
  const data = useLoaderData<typeof loader>()


  return (
    <StaffShell staffData={data.staffData}>
      {
        !data.demo ? <div /> : (
          <div className="bg-red-500 px-2 py-2 sm:px-2 md:py-2 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight ">
                  Demo Account
                </h4>
              </div>
              <div className="mt-4 flex md:ml-4 md:mt-0">
              </div>
            </div>
          </div>
        )
      }
      <div className="flex-1">

        <Outlet />
      </div>
      <footer className="bg-slate-400 px-2 py-2 sm:px-2 md:py-2 lg:px-8">
        {/* Your footer */}
        <div className="h-9" />
      </footer>
    </StaffShell>
  );
}
