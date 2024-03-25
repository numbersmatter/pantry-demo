import { ItemLine } from "~/lib/value-estimation/types/item-estimations";

export const calculateTotalValue = (items: ItemLine[]) => {
  return items.reduce((acc, item) => {
    return acc + item.quantity * item.value;
  }, 0);
};
