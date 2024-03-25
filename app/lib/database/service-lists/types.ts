import { ItemLine } from "~/lib/value-estimation/types/item-estimations";
import { SeatId } from "../seats/types/seats-model";
import {
  ServicePeriod,
  ServicePeriodDbModel,
  ServicePeriodId,
} from "../service-periods/types/service-periods-model";
import { ServiceTransactionType } from "../service-transactions/types/service-trans-model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export type ServiceListId = string;

export type ListStatus = "preparing" | "applied" | "cancelled";
interface ServiceListBase {
  name: string;
  description: string;
  service_period_id: ServicePeriodId;
  service_period: ServicePeriodDbModel;
  seats_array: SeatId[];
  service_type: ServiceTransactionType;
  service_items: ItemLine[];
  status: ListStatus;
}

export interface ServiceList extends ServiceListBase {
  id: ServiceListId;
  created_date: Date;
  applied_date: Date;
}

export interface ServiceListDbModel extends ServiceListBase {
  created_date: Timestamp | FieldValue;
  applied_date: Timestamp | FieldValue;
}

export interface ServiceListOLDDbModel {
  id: ServiceListId;
  name: string;
  description: string;
  service_period_id: ServicePeriodId;
  service_period: ServicePeriod;
  seatsArray: SeatId[];
  serviceType: ServiceTransactionType;
  serviceItems: ItemLine[];
  status: ListStatus;
  created_date: Timestamp | FieldValue;
  applied_date: Timestamp | FieldValue;
}

export interface ServiceListAdd {
  name: string;
  description: string;
  service_period_id: ServicePeriodId;
  service_period: ServicePeriodDbModel;
  seats_array: SeatId[];
  service_type: ServiceTransactionType;
  service_items: ItemLine[];
}
