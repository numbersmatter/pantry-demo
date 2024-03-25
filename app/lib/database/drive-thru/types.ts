import { Timestamp } from "firebase-admin/firestore";

export interface DriveThruFormDbModel {
  staff_id: string;
  staff_name: string;
  created_date: Timestamp;
  updated_date: Timestamp;
  form_responses: {
    language: string;
    household_adults: number;
    household_children: number;
    primary_children: number;
    elementary_children: number;
    middle_children: number;
    high_children: number;
    notes: string;
  };
}

export interface DriveThruDbAddModel {
  staff_id: string;
  staff_name: string;
  form_responses: {
    language: string;
    household_adults: number;
    household_children: number;
    primary_children: number;
    elementary_children: number;
    middle_children: number;
    high_children: number;
    notes: string;
  };
}

export interface DriveThruForm {
  id: string;
  staff_id: string;
  staff_name: string;
  created_date: Date;
  updated_date: Date;
  form_responses: {
    language: string;
    household_adults: number;
    household_children: number;
    primary_children: number;
    elementary_children: number;
    middle_children: number;
    high_children: number;
    notes: string;
  };
}
