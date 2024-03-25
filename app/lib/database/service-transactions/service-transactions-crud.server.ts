import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import {
  ServiceTransaction,
  ServiceTransactionDbModel,
} from "./types/service-trans-model";
import { db_paths } from "../firestore.server";

// function toFirestore

function serviceTransactionToDbModel(
  serviceTransaction: ServiceTransaction
): ServiceTransactionDbModel {
  const data = {
    ...serviceTransaction,
    service_created_data: Timestamp.fromDate(
      serviceTransaction.service_created_data
    ),
    service_updated_date: Timestamp.fromDate(
      serviceTransaction.service_updated_date
    ),
  };

  if (serviceTransaction.service_completed_date) {
    return {
      ...data,
      service_completed_date: Timestamp.fromDate(
        serviceTransaction.service_completed_date
      ),
    };
  }

  const { id, service_completed_date, ...rest } = data;

  return {
    ...rest,
  };
}

// firestore data converter
const serviceTransactionConverter: FirestoreDataConverter<ServiceTransaction> =
  {
    toFirestore(serviceTransaction: ServiceTransaction): DocumentData {
      return serviceTransactionToDbModel(serviceTransaction);
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): ServiceTransaction {
      const data = snapshot.data() as ServiceTransactionDbModel;

      const { service_completed_date, ...rest } = data;

      const convertedData = {
        ...rest,
        id: snapshot.id,
        service_created_data: data.service_created_data.toDate(),
        service_updated_date: data.service_updated_date.toDate(),
      };

      if (service_completed_date) {
        return {
          ...convertedData,
          service_completed_date: service_completed_date.toDate(),
        };
      }

      return {
        ...convertedData,
      };
    },
  };

const service_transactions_collection = () =>
  getFirestore()
    .collection(db_paths.service_transactions)
    .withConverter(serviceTransactionConverter);

const create = async (serviceTransaction: ServiceTransaction) => {
  const { id, ...rest } = serviceTransaction;
  const colRef = service_transactions_collection();
  const docRef = await colRef.add(serviceTransaction);
  return docRef.id;
};

const read = async (id: string) => {
  const doc = await service_transactions_collection().doc(id).get();
  return doc.data();
};

const update = async (
  id: string,
  serviceTransaction: Partial<ServiceTransactionDbModel>
) => {
  const writeResult = await service_transactions_collection()
    .doc(id)
    .update(serviceTransaction);
  return writeResult;
};

const remove = async (id: string) => {
  await service_transactions_collection().doc(id).delete();
};

type OpStr =
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "array-contains"
  | "in"
  | "array-contains-any";

const queryByField = async (
  fieldName: keyof ServiceTransactionDbModel,
  opStr: OpStr,
  value: string
) => {
  const querySnapshot = await service_transactions_collection()
    .where(fieldName, "==", value)
    .get();
  return querySnapshot.docs.map((doc) => doc.data());
};

export const serviceTransactionsDb = {
  create,
  read,
  update,
  remove,
  queryByField,
};
