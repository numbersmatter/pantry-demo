import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import VerticalSteps, { Vstep } from "./steps";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const steps: Vstep[] = [
    { name: 'Create account', description: 'Vitae sed mi luctus laoreet.', to: '1', status: 'complete' },
    {
      name: 'Profile information',
      description: 'Cursus semper viverra facilisis et et some more.',
      to: '2',
      status: 'current',
    },
    { name: 'Business information', description: 'Penatibus eu quis ante.', to: '3', status: 'upcoming' },
    { name: 'Theme', description: 'Faucibus nec enim leo et.', to: '#', status: 'upcoming' },
    { name: 'Preview', description: 'Iusto et officia maiores porro ad non quas.', to: '4', status: 'upcoming' },
  ]

  return json({ steps });
};




export default function Route() {
  const { steps } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto py-5 px-1 w-80 md:w-96">
      <VerticalSteps steps={steps} />
    </div>
  )

}