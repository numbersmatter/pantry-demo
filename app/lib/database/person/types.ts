import { Timestamp } from "firebase-admin/firestore";

export type PersonType = "caregiver" | "student" | "non-student-child";

export type PersonDbModel = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  type: PersonType;
  created_date: Timestamp;
  updated_date: Timestamp;
};

export type PersonId = string;

export type PersonAppModel = {
  id: PersonId;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  type: PersonType;
  created_date: Date;
  updated_date: Date;
};

export type PersonAdd = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  type: PersonType;
};
