import { Timestamp } from "firebase-admin/firestore";

export type ServicePeriodId = string;
type ServicePeriodCapacity = number; // number of active seats
type ProgramId = string;

export interface ServicePeriod {
  id: ServicePeriodId;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  created_date: Date;
  updated_date: Date;
  capacity: ServicePeriodCapacity;
  program_id: ProgramId;
}

export interface ServicePeriodDbModel {
  name: string;
  description: string;
  start_date: Timestamp;
  end_date: Timestamp;
  created_date: Timestamp;
  updated_date: Timestamp;
  capacity: ServicePeriodCapacity;
  program_id: ProgramId;
}
