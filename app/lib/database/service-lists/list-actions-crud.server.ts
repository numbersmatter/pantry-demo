// This is to track all bulk operations of the service list

import {
  FieldValue,
  QueryDocumentSnapshot,
  Timestamp,
  getFirestore,
} from "firebase-admin/firestore";
import { ServiceListId } from "./types";
import { db_paths } from "../firestore.server";
import { ItemLine } from "~/lib/value-estimation/types/item-estimations";

export interface TransactionRecord {
  seat_id: string;
  transactionId: string;
  value: number;
}

interface BulkAction {
  records_created: TransactionRecord[];
  records_updated: TransactionRecord[];
  records_canceled: TransactionRecord[];
  records_unchanged: TransactionRecord[];
  seats_array: string[];
  line_items: ItemLine[];
  service_list_id: ServiceListId;
  staff: {
    staff_id: string;
    staff_name: string;
  };
}

interface BulkActionDbModelWrite extends BulkAction {
  created_date: Timestamp | FieldValue;
  updated_date: Timestamp | FieldValue;
}

interface BulkActionDbModel extends BulkAction {
  created_date: Timestamp;
  updated_date: Timestamp;
}

interface BulkActionAppModel extends BulkActionDbModel {
  id: string;
}

const converter = () => ({
  toFirestore: (data: BulkActionDbModel) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as BulkActionDbModel,
});

const actionsCollection = (serviceListID: ServiceListId) => {
  const actionCollectionPath = `${db_paths.service_list}/${serviceListID}/actions`;

  return getFirestore()
    .collection(db_paths.service_list)
    .doc(serviceListID)
    .collection("actions")
    .withConverter(converter());
};

export const createBulkAction = async (bulkAction: BulkAction) => {
  const actionCollection = actionsCollection(bulkAction.service_list_id);
  const docData = {
    ...bulkAction,
    created_date: FieldValue.serverTimestamp(),
    updated_date: FieldValue.serverTimestamp(),
  };

  return await actionCollection.add(docData);
};

export const readBulkAction = async ({
  service_list_id,
  bulk_action_id,
}: {
  service_list_id: ServiceListId;
  bulk_action_id: string;
}) => {
  const collRef = actionsCollection(service_list_id);
  const docRef = await collRef.doc(bulk_action_id).get();

  if (!docRef.data()) {
    return null;
  }

  const data = {
    ...docRef.data(),
    id: docRef.id,
  };

  return data;
};

const updateBulkAction = async ({
  service_list_id,
  bulk_action_id,
  bulk_action,
}: {
  service_list_id: ServiceListId;
  bulk_action_id: string;
  bulk_action: Partial<BulkAction>;
}) => {
  const collRef = actionsCollection(service_list_id);
  const docRef = collRef.doc(bulk_action_id);

  const updateData = {
    ...bulk_action,
    updated_date: FieldValue.serverTimestamp(),
  };
};

const ofServiceList = async (service_list_id: ServiceListId) => {
  const collRef = actionsCollection(service_list_id);
  const query = await collRef.orderBy("created_date", "desc").get();

  const data = query.docs.map((doc) => ({
    ...doc.data(),
    created_date: doc.data().created_date.toDate(),
    updated_date: doc.data().updated_date.toDate(),
    id: doc.id,
  }));

  return data;
};

const last_action = async (service_list_id: ServiceListId) => {
  const collRef = actionsCollection(service_list_id);
  const query = await collRef.orderBy("created_date", "desc").limit(1).get();

  if (query.empty) {
    return null;
  }

  const doc = query.docs[0];
  return {
    ...doc.data(),
    created_date: doc.data().created_date.toDate(),
    updated_date: doc.data().updated_date.toDate(),
    id: doc.id,
  };
};

export const bulkListActionsDb = {
  read: readBulkAction,
  create: createBulkAction,
  update: updateBulkAction,
  ofServiceList: ofServiceList,
  last_action: last_action,
};
