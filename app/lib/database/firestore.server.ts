import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { programsDb } from "./programs/programs-crud.server";
import { programAreaDb } from "./program-area/program-area-crud.server";
import { servicePeriodsDb } from "./service-periods/service-periods-crud.server";
import { staffDb } from "./staff/staff-crud.server";
import { familyDb } from "./families/family-crud.server";
import { driveFormDb } from "./drive-thru/drive-thru-crud.server";
import { bulkListActionsDb } from "./service-lists/list-actions-crud.server";

// helper function to firestore data to typescript
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const dataPoint = <T extends FirebaseFirestore.DocumentData>(
  collectionPath: string
) => getFirestore().collection(collectionPath).withConverter(converter<T>());

type FirestorCollectionPath = string;
interface NonprofitDbPaths {
  [key: string]: FirestorCollectionPath;
}

export const fireDb = (path: FirestorCollectionPath) =>
  getFirestore().collection(path);

export const db_paths = {
  servicePeriods: "/service_periods",
  seats: "/seats",
  applications: "/nonprofits/cist/applications",
  service_transactions: "/service_transactions",
  // foodBoxOrders: "/food_box_orders",
  // packedFoodBoxes: "/nonprofits/cist/inventory/food_pantry/packed_food_boxes",
  programAreas: "/program_areas",
  programs: "/programs",
  persons: "/persons",
  families: "/families",
  service_list: "/service_lists",
  staff: "/staff",
  drive_thru: "/drive_thru",
  hello: "/drive_thru",
};

export const db = {
  programs: programsDb,
  program_areas: programAreaDb,
  service_period: servicePeriodsDb,
  staff: staffDb,
  families: familyDb,
  drive_thru: driveFormDb,
  bulk_list_actions: bulkListActionsDb,
};
