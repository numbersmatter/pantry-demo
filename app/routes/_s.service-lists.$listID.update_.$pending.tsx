import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";




export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  return json({});
};




export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="prose">

    </div>
  )

}