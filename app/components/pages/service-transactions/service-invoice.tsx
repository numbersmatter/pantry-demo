import { FormDialogVer1 } from "~/components/common/form-dialog";
import ServiceTransactionHeader from "./headers";
import { ServiceTransaction, ServiceTransactionValue } from "~/lib/database/service-transactions/types/service-trans-model";
import { CalendarDaysIcon, CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { Seat } from "~/lib/database/seats/types/seats-model";
import { dollarValueConverter } from "~/lib/value-estimation/utils";
import { FoodBoxOrder } from "~/lib/database/food-box-order/types/food-box-order-model";
import { ItemLine } from "~/lib/value-estimation/types/item-estimations";



export function ServiceInvoice({
  service,
  familyName,
  seat,
  children
}: {
  seat: Seat,
  service: ServiceTransaction,
  familyName: string,
  children?: React.ReactNode
}) {

  return (
    <>
      <ServiceTransactionHeader service={service} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <InvoiceSummery service={service} familyName={familyName} />

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
                    {familyName}
                  </span>
                  <br />
                  {seat.address.street}
                  <br />
                  {seat.address.unit}
                  <br />
                  {seat.address.city}, {seat.address.state} {seat.address.zip}
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
                {children}

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
    </>

  )
}

function InvoiceSummery({ service, familyName }: { service: ServiceTransaction, familyName: string }) {

  const dollarValue = dollarValueConverter(service.value);

  return <div className="lg:col-start-3 lg:row-end-1">
    <h2 className="sr-only">Summary</h2>
    <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
      <dl className="flex flex-wrap">
        <div className="flex-auto pl-6 pt-6">
          <dt className="text-sm font-semibold leading-6 text-gray-900">
            Value
          </dt>
          <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">{dollarValue}</dd>
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
          <dd className="text-sm font-medium leading-6 text-gray-900">
            {familyName}
          </dd>
        </div>
        <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
          <dt className="flex-none">
            <span className="sr-only">Recieved</span>
            <CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
          </dt>
          <dd className="text-sm leading-6 text-gray-500">
            {service.service_completed_date ? new Date(service.service_completed_date).toDateString() : "Not Completed"}
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
  </div>;
}


export function FoodBoxRequestInvoiceTable({
  foodBoxOrder }: {
    foodBoxOrder: FoodBoxOrder
  }) {
  const invoiceItems = foodBoxOrder.items.map((item) => {
    return {
      ...item,
      value: dollarValueConverter(item.value),
    }
  })
  return (
    <>
      {
        invoiceItems.map((item) => (
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
        ))
      }
    </>


  )
}
