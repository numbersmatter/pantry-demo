import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await protectedRoute(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("q");



  return json({});
};

