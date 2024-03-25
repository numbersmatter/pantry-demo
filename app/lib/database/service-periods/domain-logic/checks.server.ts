import { servicePeriodsDb } from "../service-periods-crud.server";
import { ServicePeriodId } from "../types/service-periods-model";

// check if service period id exists
export const servicePeriodExists = async (servicePeriodId: ServicePeriodId) => {
  const servicePeriod = await servicePeriodsDb.read(servicePeriodId);
  return !!servicePeriod;
};
