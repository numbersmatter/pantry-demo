import { getFirestore } from "firebase-admin/firestore";
import { cis_t_Db, dataPoint } from "../firestore.server";

interface StaffDoc {
  fname: string;
  lname: string;
}

const staff_collection = dataPoint<StaffDoc>(cis_t_Db.staff);

const read = async (staff_id: string) => {
  const doc = await staff_collection.doc(staff_id).get();
  return doc.data();
};

export const staffDb = {
  read,
};
