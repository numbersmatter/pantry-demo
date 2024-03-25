import { ServiceTransactionId } from "~/lib/database/service-transactions/types/service-trans-model";
import {
  ItemLine,
  ValueEstimationProcess,
  ValueEstimationType,
} from "~/lib/value-estimation/types/item-estimations";

export type DeliveryMethods =
  | "DoorDash"
  | "Drive-thru"
  | "Pick-up"
  | "Staff-delivery";

export interface FoodBoxOrderDbModel {
  delivery_method: DeliveryMethods;
  items: ItemLine[];
  notes: string;
  photo_url: string;
  value_estimation_type: ValueEstimationType;
  value_estimation_process: ValueEstimationProcess;
}

export interface FoodBoxOrder extends FoodBoxOrderDbModel {
  id: ServiceTransactionId;
}
