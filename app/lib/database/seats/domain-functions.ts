import { z } from "zod";
import { db } from "../firestore.server";
import { makeDomainFunction } from "domain-functions";

const addSeatsFromServicePeriod = async ({
  service_period_id_from,
  service_period_id_to,
}: {
  service_period_id_from: string;
  service_period_id_to: string;
}) => {
  const allSeats = await db.seats.queryByString(
    "service_period_id",
    service_period_id_from
  );

  const writeNewSeatsPromises = allSeats.map((seat) => {
    const seatInfo = {
      ...seat,
      service_period_id: service_period_id_to,
    };
    return db.seats.create(seatInfo);
  });

  const newSeatIds = await Promise.all(writeNewSeatsPromises);

  return {
    status: 200,
    message: "All Seats added",
  };
};

export const AddFromServicePeriodSchema = z.object({
  servicePeriod: z.string().length(20),
  type: z.enum(["addFromServicePeriod"]),
});

export const addFromServicePeriodMutation = (service_period_id_to: string) =>
  makeDomainFunction(AddFromServicePeriodSchema)(async (values) => {
    const service_period_id_from = values.servicePeriod;
    const result = await addSeatsFromServicePeriod({
      service_period_id_from,
      service_period_id_to,
    });
    return result;
  });
