import { seatsDb } from "../database/seats/seats-crud.server";
import { servicePeriodsDb } from "../database/service-periods/service-periods-crud.server";

const getAllActiveSeatsOnServicePeriod = async (service_period_id: string) => {
  const seatsOfServicePeriod = await seatsDb.queryByString(
    "service_period_id",
    service_period_id
  );

  const activeSeats = seatsOfServicePeriod.filter(
    (seat) => seat.status === "active"
  );

  return activeSeats;
};

const createServiceList = async (values: any) => {
  const service_period = await servicePeriodsDb.read(values.service_period_id);
  if (!service_period) {
    throw new Response("Service period not found");
  }

  //  Get all the active seats for the service period
  const seatsInPeriod = await seatsDb.queryByString(
    "service_period_id",
    values.service_period_id
  );

  const activeSeats = seatsInPeriod.filter((seat) => seat.status === "active");

  const seatsIds = activeSeats.map((seat) => seat.id);
};
