import { ServiceTransaction } from "../types/service-trans-model";
import { serviceTransactionsDb } from "../service-transactions-crud.server";
import { makeDomainFunction } from "domain-functions";
import { z } from "zod";

const addSchema = z.object({});
export const addFromPeriod = z.object({
  seatId: z.string().default("newSeatID"),
  serviceType: z.enum(["FoodBoxOrder", "Other"]).default("FoodBoxOrder"),
  value: z.number().default(0),
  status: z.enum(["pending", "received", "cancelled"]).default("pending"),
  servicePeriodId: z.string().min(3),
});

export const recordServiceMutation = makeDomainFunction(addFromPeriod)(
  async (values) => {
    const transaction: ServiceTransaction = {
      id: "",
      delivered_to: values.seatId,
      service_created_data: new Date(),
      service_updated_date: new Date(),
      status: values.status,
      service_type: values.serviceType,
      value: values.value,
      service_period_id: values.servicePeriodId,
    };

    const docId = await serviceTransactionsDb.create(transaction);
    return docId;
  }
);
