import { Timestamp } from "firebase-admin/firestore";
import { SeatId } from "~/lib/database/seats/types/seats-model";

export type ServiceTransactionId = string;
type ServiceTransactionStatus = "pending" | "received" | "cancelled";

export type ServiceTransactionType = "FoodBoxOrder" | "Other";

// transaction value in cents
export type ServiceTransactionValue = number;

export interface ServiceTransaction {
  id: ServiceTransactionId;
  delivered_to: SeatId;
  service_created_data: Date;
  service_updated_date: Date;
  service_completed_date?: Date;
  status: ServiceTransactionStatus;
  service_type: ServiceTransactionType;
  value: ServiceTransactionValue;
  service_period_id: string;
}

export interface ServiceTransactionDbModel {
  delivered_to: SeatId;
  service_created_data: Timestamp;
  service_updated_date: Timestamp;
  service_completed_date?: Timestamp;
  status: ServiceTransactionStatus;
  service_type: ServiceTransactionType;
  value: ServiceTransactionValue;
  service_period_id: string;
}

export interface ServiceTransactionCreateDbModel {
  delivered_to: SeatId;

  status: ServiceTransactionStatus;
  service_type: ServiceTransactionType;
  value: ServiceTransactionValue;
}
