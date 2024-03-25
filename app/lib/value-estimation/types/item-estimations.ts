export type ItemTypes =
  | "packed-box"
  | "pre-packed-box"
  | "individual-items"
  | "menu-box"
  | "other";
export type ValueEstimationType = "exact" | "approximate" | "other";
export type ValueEstimationProcess =
  | "Walmart"
  | "batch-estimate"
  | "other"
  | "org-assigned";

export interface ItemLine {
  item_name: string;
  type: ItemTypes;
  quantity: number;
  value: number;
  item_id: string;
}
