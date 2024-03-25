import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import DataCards from "~/components/pages/home/data-cards";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const driveThruData = await db.drive_thru.afterDate(new Date("2024-03-21T19:18:00.017Z"));

  const data = driveThruData;

  const totalFamilies = driveThruData.length;
  const totalAdults = driveThruData.reduce((acc, curr) => acc + curr.form_responses.household_adults, 0
  );

  const totalChildren = driveThruData.reduce((acc, curr) =>
    acc + curr.form_responses.household_children, 0
  )

  const totalPrimary = driveThruData.reduce((acc, curr) =>
    acc + curr.form_responses.primary_children, 0
  )

  const totalElementary = driveThruData.reduce((acc, curr) =>
    acc + curr.form_responses.elementary_children, 0
  )

  const totalMiddle = driveThruData.reduce((acc, curr) =>
    acc + curr.form_responses.middle_children, 0
  )

  const totalHigh = driveThruData.reduce((acc, curr) =>
    acc + curr.form_responses.high_children, 0
  )

  const totalStudents = totalPrimary + totalElementary + totalMiddle + totalHigh;

  const nonSchoolChildren = totalChildren - totalStudents;

  const spanishSpeaking = driveThruData.filter((data) => data.form_responses.language === "es").length;

  const dashData = {
    totalFamilies,
    totalAdults,
    totalChildren,
    totalPrimary,
    totalElementary,
    totalMiddle,
    totalHigh,
    totalStudents,
    nonSchoolChildren,
    spanishSpeaking,
  }



  return json({ driveThruData, dashData });
};



export default function StaffIndex() {
  const { dashData } = useLoaderData<typeof loader>();



  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{/* Content goes here */}
      <div className="prose py-2 md:py-5">
        <h1>Dashboard</h1>
      </div>
      <div>
        <DataCards stats={[
          { name: 'Total Families', stat: dashData.totalFamilies.toString() },
          { name: 'Total Children', stat: dashData.totalChildren.toString() },
          { name: 'Total Primary Students', stat: dashData.totalPrimary.toString() },
          { name: 'Elementary Students', stat: dashData.totalElementary.toString() },
          { name: 'Middle School Students', stat: dashData.totalMiddle.toString() },
          { name: 'High School Students', stat: dashData.totalHigh.toString() },
          { name: 'Non-School Children', stat: dashData.nonSchoolChildren.toString() },
          { name: 'Total Students', stat: dashData.totalStudents.toString() },
          { name: 'Total Adults', stat: dashData.totalAdults.toString() },
          { name: 'Spanish Speaking Families', stat: dashData.spanishSpeaking.toString() },
        ]} />
      </div>
    </div>
  )

}