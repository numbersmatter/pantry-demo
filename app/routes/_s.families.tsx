import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { RouteError, StandardError } from "~/components/common/ErrorPages";
import { ContainerPadded } from "~/components/common/containers";



export default function FamiliesRoute() {
  return (
    <ContainerPadded>
      <Outlet />
    </ContainerPadded>
  );
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