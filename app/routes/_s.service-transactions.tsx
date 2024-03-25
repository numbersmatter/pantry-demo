import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import Route from "./_s.service-periods.$periodID._index";
import { RouteError, StandardError } from "~/components/common/ErrorPages";


export default function ServiceTransactionRoute() {

  return (
    <Outlet />
  )

}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <RouteError routeError={error} />;
  }
  else if (error instanceof Error) {
    return (
      <StandardError error={error} />
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}


