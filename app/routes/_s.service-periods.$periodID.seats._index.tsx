import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { DropdownNavMenu } from "~/components/common/dropdown-nav-menu";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers";
import { DataTable, SelectableRowTable, SelectableTableComp } from "~/components/display/data-table";
import { useSelectableTable } from "~/components/display/data-table-hook";
import { ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { familyDb } from "~/lib/database/families/family-crud.server";
import { FamilyAppModel } from "~/lib/database/families/types";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { seatsOfServicePeriod } from "~/lib/database/seats/seats-tables";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const baseUrl = `/service-periods/${params.periodID}`;
  const service_period_id = params.periodID ?? "periodID";

  // get seats in period
  const seats_in_period = await seatsDb.queryByString(
    "service_period_id", service_period_id
  );

  const seatsOrdered = seats_in_period.sort((a, b) => {
    return b.enrolled_date.getTime() - a.enrolled_date.getTime();
  })

  // create an array of read promises for the families
  const familyPromises = seats_in_period.map(seat => {
    return familyDb.read(seat.application_id);
  });

  // resolve the promises
  const familiesUnfiltered = await Promise.all(familyPromises);
  const families = familiesUnfiltered.filter(family => family !== undefined) as FamilyAppModel[];

  // add the family data to the seat object
  const seatsWithFamilies = seatsOrdered.map((seat, index) => {
    const family = families.find(family => family.id === seat.application_id);
    if (!family) return;
    return {
      ...seat,
      family_name: family.family_name,
      family_id: family.id,
      number_of_members: family.members.length,

    }
  });



  return json({ baseUrl, seats: seatsWithFamilies });
};

export default function Route() {
  const { baseUrl, seats } = useLoaderData<typeof loader>();
  const seatsData = seats.map(seat => {
    return {
      id: seat.id,
      family_name: seat.family_name,
      enrolled_date: new Date(seat.enrolled_date),
      number_of_members: seat.number_of_members,
    }
  })
  // const { table } = useSelectableTable({ data: seatsData, columns: seatsOfServicePeriod })

  const menuItems = [
    { label: 'New Family and Seat', textValue: 'family' },
    { label: 'New Seat', textValue: 'seat' },
  ]

  const onMenuSelect = (value: string) => {
    console.log('menu select', value);
  }

  return (
    <main className="pb-9 ">
      <SectionHeaderWithAddAction
        title="Seats"
        addButton={<ActionButton title="Add Seat"
        />}
      />
      <DataTable
        columns={seatsOfServicePeriod}
        data={seatsData}
      />
      <div className="py-3">

        <pre>{JSON.stringify(seats, null, 2)}</pre>
        {/* <SelectableTableComp columns={seatsOfServicePeriod} table={table} /> */}
      </div>
    </main>
  )
};

function ActionButton({ title, }: { title: string, }) {
  return (
    <Link
      to="add"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      {title}
    </Link>
  )
}