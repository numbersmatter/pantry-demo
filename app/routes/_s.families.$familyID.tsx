import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import FamilyDisplay from "~/components/pages/families/family-display";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  let familyId = params["familyID"] ?? "familyID";

  const familyDoc = await db.families.read(familyId);
  if (!familyDoc) {
    throw new Error("Family not found")
  }

  const family = familyDoc;
  return json({ family });
};




export default function Route() {
  const { family } = useLoaderData<typeof loader>();

  const familyData = {
    ...family,
    created_date: new Date(family.created_date)
  }
  return (
    <div>
      <FamilyDisplay family={familyData} />
    </div>
  )
}