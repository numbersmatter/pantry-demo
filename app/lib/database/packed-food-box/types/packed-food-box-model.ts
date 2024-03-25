import { Timestamp } from "firebase-admin/firestore";
import {
  ItemLine,
  ValueEstimationType,
} from "~/lib/value-estimation/types/item-estimations";
export type PackedFoodBoxId = string;

export interface PackedFoodBoxDbModel {
  items: ItemLine[];
  notes: string;
  value: number;
  photo_url: string;
  value_estimation_type: ValueEstimationType;
  date_packed: Timestamp;
}

export interface PackedFoodBox {
  id: PackedFoodBoxId;
  items: ItemLine[];
  notes: string;
  value: number;
  photo_url: string;
  value_estimation_type: ValueEstimationType;
  date_packed: Date;
}
