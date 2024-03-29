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

if (!process.env.BASEPATH) {
  throw new Error("BASEPATH environment variable is missing");
}

const basePath = process.env.BASEPATH;

export const db_paths = {
  servicePeriods: `${basePath}service_periods`,
  seats: `${basePath}seats`,
  applications: `${basePath}applications`,
  service_transactions: `${basePath}service_transactions`,
  foodBoxOrders: `${basePath}food_box_orders`,
  packedFoodBoxes: `${basePath}inventory/food_pantry/packed_food_boxes`,
  programAreas: `${basePath}program_areas`,
  programs: `${basePath}programs`,
  persons: `${basePath}persons`,
  families: `${basePath}families`,
  service_list: `${basePath}service_lists`,
  staff: `${basePath}staff`,
  drive_thru: `${basePath}drive_thru`,
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
