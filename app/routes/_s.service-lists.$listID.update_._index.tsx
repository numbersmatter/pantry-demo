import { Link, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  return json({});
};








export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="prose">
      <ul>
        <li>
          <Link to="change-items">Change Items</Link>
        </li>
        <li>
          <Link to="add-seats">Add Seats</Link>
        </li>
        <li>
          <Link to="remove-seats">Remove Seats</Link>
        </li>
      </ul>
    </div>
  )


}