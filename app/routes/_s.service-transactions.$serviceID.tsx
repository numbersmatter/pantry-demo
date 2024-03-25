import { UserCircleIcon, } from "@heroicons/react/24/outline";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CalendarDaysIcon, CreditCardIcon } from "lucide-react";
import { ContainerPadded } from "~/components/common/containers";
import { FormDialogVer1 } from "~/components/common/form-dialog";
import ServiceTransactionHeader from "~/components/pages/service-transactions/headers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { FoodBoxOrder } from "~/lib/database/food-box-order/types/food-box-order-model";
import { serviceTransactionsDb } from "~/lib/database/service-transactions/service-transactions-crud.server";

const foodBoxRequest: FoodBoxOrder = {
  id: "1",
  photo_url: "",
  notes: "",
  value_estimation_process: "other",
  value_estimation_type: "other",
  delivery_method: 'DoorDash',
  items: [
    {
      item_id: "1",
      item_name: "Packed Box",
      value: 0,
      quantity: 1,
      type: "packed-box"

    },

  ],
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const serviceID = params["serviceID"] ?? "serviceID";

  const service = await serviceTransactionsDb.read(serviceID);
  if (!service) {
    return redirect("/service-transactions");
  }

  const lineItems = foodBoxRequest

  return json({ serviceID, service, lineItems });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};









export default function ServiceTransactionServiceIDRoute() {
  const { serviceID, service, lineItems } = useLoaderData<typeof loader>();

  const { service_completed_date, ...rest } = service

  const serviceTransaction = {
    ...rest,
    service_created_data: new Date(service.service_created_data),
    service_updated_date: new Date(service.service_updated_date),
  }

  return (
    <ContainerPadded>
      <ServiceTransactionHeader service={serviceTransaction} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <div className="lg:col-start-3 lg:row-end-1">
            <h2 className="sr-only">Summary</h2>
            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
              <dl className="flex flex-wrap">
                <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">
                    Value
                  </dt>
                  <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">${service.value.toFixed(2)}</dd>
                </div>
                <div className="flex-none self-end px-6 pt-4">
                  <dt className="sr-only">Status</dt>
                  <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                    Paid
                  </dd>
                </div>
                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <dt className="flex-none">
                    <span className="sr-only">Client</span>
                    <UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd className="text-sm font-medium leading-6 text-gray-900">Family Name</dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Recieved</span>
                    <CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    {
                      service.service_completed_date ? new Date(service.service_completed_date).toDateString() : "Not Completed"
                    }
                  </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Status</span>
                    <CreditCardIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    {service.status}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                  Go to family <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Food Box Request */}
          <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Transaction
            </h2>
            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
              <div className="sm:pr-4">
                <dt className="inline text-gray-500">
                  Created On {new Date(service.service_created_data).toDateString()}
                </dt>{' '}
                <dd className="inline text-gray-700">
                  { }
                </dd>
              </div>
              <div className="mt-2 sm:mt-0 sm:pl-4">
                <dt className="inline text-gray-500"></dt>{' '}
                <dd className="inline text-gray-700">
                  <time dateTime="2023-31-01"></time>
                </dd>
              </div>
              <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                <dt className="font-semibold text-gray-900">From</dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">
                    Food Delivery Program
                  </span>
                  <br />
                  Communities in Schools Thomasville
                  <br />

                </dd>
              </div>
              <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                <dt className="font-semibold text-gray-900">To</dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">
                    Family
                  </span>
                  <br />
                  {/* 886 Walter Street */}
                  <br />
                  {/* New York, NY 12345 */}
                </dd>
              </div>
            </dl>
            <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
              <colgroup>
                <col className="w-full" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="border-b border-gray-200 text-gray-900">
                <tr>
                  <th scope="col" className="px-0 py-3 font-semibold">
                    Service Items
                  </th>
                  <th scope="col" className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell">
                    Type
                  </th>
                  <th scope="col" className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell">
                    Quanity
                  </th>
                  <th scope="col" className="py-3 pl-8 pr-0 text-right font-semibold">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {foodBoxRequest.items.map((item) => (
                  <tr key={item.item_id} className="border-b border-gray-100">
                    <td className="max-w-0 px-0 py-5 align-top">
                      <div className="truncate font-medium text-gray-900">
                        {item.item_name}
                      </div>
                      <div className="truncate text-gray-500">
                        {item.item_name}
                      </div>
                    </td>
                    <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                      {item.type}
                    </td>
                    <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                      {item.quantity}
                    </td>
                    <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">{item.value}</td>
                  </tr>
                ))}

              </tbody>
            </table>
            <div className="mt-6 border-t border-gray-900/5 pt-6">
              <FormDialogVer1 />
            </div>
          </div>

          <div className="lg:col-start-3">
            {/* Activity feed */}
            <h2 className="text-sm font-semibold leading-6 text-gray-900">Activity</h2>
          </div>
        </div>
      </div>
    </ContainerPadded>
  )
}