import { Timestamp } from "firebase-admin/firestore";

export interface FamilyDbModel {
  primary_user_id?: string;
  created_date: Timestamp;
  family_name: string;
  members: string[];
}

export interface FamilyAdd {
  primary_user_id?: string;
  family_name: string;
  members: string[];
}

export interface FamilyAppModel extends FamilyAdd {
  id: string;
  created_date: Date;
}
