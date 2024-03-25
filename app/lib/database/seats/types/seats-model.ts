import { Timestamp } from "firebase-admin/firestore";
import { ServicePeriodId } from "~/lib/database/service-periods/types/service-periods-model";

export type SeatId = string;

export interface Seat {
  id: SeatId;
  family_id: string;
  family_name: string;
  service_period_id: ServicePeriodId;
  application_id: string;
  is_active: boolean;
  status: "pending" | "active" | "inactive";
  created_date: Date;
  updated_date: Date;
  enrolled_date: Date;
  unenrolled_date?: Date;
  delivery_notes: string;
  address: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface SeatDbModel {
  service_period_id: ServicePeriodId;
  delivery_notes: string;
  family_id: string;
  family_name: string;
  application_id: string;
  is_active: boolean;
  status: "pending" | "active" | "inactive";
  created_date: Timestamp;
  updated_date: Timestamp;
  enrolled_date: Timestamp;
  unenrolled_date?: Timestamp;
  address: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface SeatAdd {
  service_period_id: ServicePeriodId;
  delivery_notes: string;
  application_id: string;
  is_active: boolean;
  status: "pending" | "active" | "inactive";
  family_id: string;
  family_name: string;
  address: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
  };
}
