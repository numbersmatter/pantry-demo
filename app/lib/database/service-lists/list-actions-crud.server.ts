// This is to track all bulk operations of the service list

import {
  FieldValue,
  QueryDocumentSnapshot,
  Timestamp,
  getFirestore,
} from "firebase-admin/firestore";
import { ServiceListId } from "./types";
import { cis_t_Db } from "../firestore.server";
import { ItemLine } from "~/lib/value-estimation/types/item-estimations";

interface TransactionRecord {
  seatId: string;
  transactionId: string;
}

interface BulkAction {
  records_created: TransactionRecord[];
  records_updated: TransactionRecord[];
  records_canceled: TransactionRecord[];
  records_unchanged: TransactionRecord[];
  seats_array: string[];
  user_id_created: string;
  line_items: ItemLine[];
  applied_date: Timestamp;
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
  const actionCollectionPath = `${cis_t_Db.service_list}/${serviceListID}/actions`;

  return getFirestore()
    .collection(cis_t_Db.service_list)
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

export const bulkListActionsDb = {
  read: readBulkAction,
  create: createBulkAction,
  update: updateBulkAction,
};
