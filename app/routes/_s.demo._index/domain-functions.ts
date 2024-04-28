import { db } from "~/lib/database/firestore.server";

export const getWeekPlans = async () => {
  const weekplans = await db.weekplan.getAll();
  return weekplans;
};
