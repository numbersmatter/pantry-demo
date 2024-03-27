import { Timestamp } from "firebase-admin/firestore";

export interface FamilyDbModel extends FamilyAdd {
  created_date: Timestamp;
}

export interface FamilyAdd {
  primary_user_id?: string;
  family_name: string;
  members: string[];
  address: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
  };
  students: {
    tps: number;
    lds: number;
    tms: number;
    ths: number;
  };
}

export interface FamilyAppModel extends FamilyAdd {
  id: string;
  created_date: Date;
}
