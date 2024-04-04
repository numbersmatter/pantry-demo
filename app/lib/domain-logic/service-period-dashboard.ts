import { FamilyAppModel } from "../database/families/types";
import { db } from "../database/firestore.server";

export const reportServicePeriodDashboard = async (
  service_period_id: string
) => {
  const service_period = await db.service_period.read(service_period_id);

  const all_transactions = await db.service_transactions.queryByField(
    "service_period_id",
    "==",
    service_period_id
  );

  const active_transactions = all_transactions.filter(
    (transaction) => transaction.status !== "cancelled"
  );

  const number_of_transactions = active_transactions.length;

  const set_of_seat_ids = new Set(
    active_transactions.map((transaction) => transaction.delivered_to)
  );

  const number_of_seats = set_of_seat_ids.size;

  // all seat ids that have had a transaction in this period
  const arr_of_seat_ids = Array.from(set_of_seat_ids);

  // read those seat
  const seats = await db.seats.readMany(arr_of_seat_ids);

  // make an array of family ids
  const family_ids = Array.from(new Set(seats.map((seat) => seat.family_id)));

  // read those families
  const families = await db.families.readMany(family_ids);
  const family_data_ids = families.map((family) => family.id);

  // seats where we also have family data
  const seats_with_family_data = seats
    .filter((seat) => family_data_ids.includes(seat.family_id))
    .map((seat) => {
      const family = families.find(
        (family) => family.id === seat.family_id
      ) as FamilyAppModel;

      return {
        ...seat,
        family,
      };
    });

  const student_totals_tps = seats_with_family_data.reduce(
    (acc, seat) => acc + seat.family.students.tps,
    0
  );
  const student_totals_lds = seats_with_family_data.reduce(
    (acc, seat) => acc + seat.family.students.lds,
    0
  );
  const student_totals_tms = seats_with_family_data.reduce(
    (acc, seat) => acc + seat.family.students.tms,
    0
  );

  const student_totals_ths = seats_with_family_data.reduce(
    (acc, seat) => acc + seat.family.students.ths,
    0
  );

  const student_totals =
    student_totals_tps +
    student_totals_lds +
    student_totals_tms +
    student_totals_ths;

  const community_value = active_transactions.reduce(
    (acc, transaction) => acc + transaction.value,
    0
  );

  const community_value_dollars = community_value / 100;

  const stats = [
    { name: "Total Services", stat: active_transactions.length.toString() },
    { name: "Total Unique Families", stat: set_of_seat_ids.size.toString() },
    { name: "Total Transactions", stat: active_transactions.length.toString() },
    { name: "Community Value", stat: community_value_dollars.toString() },
    { name: "Unique students", stat: student_totals.toString() },
    { name: "Primary School Students", stat: student_totals_tps.toString() },
    { name: "Elementary School Students", stat: student_totals_lds.toString() },
    { name: "Middle School Students", stat: student_totals_tms.toString() },
    { name: "High School Students", stat: student_totals_ths.toString() },
  ];

  return stats;
};
