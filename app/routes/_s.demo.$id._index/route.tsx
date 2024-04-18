import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";




export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  return json({});
};




export default function Route() {
  const { } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Route</h1>
    </div>
  )

}



