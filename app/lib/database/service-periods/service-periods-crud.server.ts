// service-periods CRUD operations
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { cis_t_Db, dataPoint } from "../firestore.server";
import {
  ServicePeriod,
  ServicePeriodDbModel,
} from "./types/service-periods-model";

// Function to convert ServicePeriod to ServicePeriodDbModel
export function servicePeriodToDbModel(
  servicePeriod: ServicePeriod
): ServicePeriodDbModel {
  return {
    ...servicePeriod,
    start_date: Timestamp.fromDate(servicePeriod.start_date),
    end_date: Timestamp.fromDate(servicePeriod.end_date),
    created_date: Timestamp.fromDate(servicePeriod.created_date),
    updated_date: Timestamp.fromDate(servicePeriod.updated_date),
  };
}

// Firestore data converter
const servicePeriodConverter: FirestoreDataConverter<ServicePeriod> = {
  toFirestore(servicePeriod: ServicePeriod): DocumentData {
    return servicePeriodToDbModel(servicePeriod);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ServicePeriod {
    const data = snapshot.data() as ServicePeriodDbModel;
    return {
      ...data,
      id: snapshot.id,
      start_date: data.start_date.toDate(),
      end_date: data.end_date.toDate(),
      created_date: data.created_date.toDate(),
      updated_date: data.updated_date.toDate(),
    };
  },
};

const service_periods_collection = () =>
  getFirestore()
    .collection(cis_t_Db.servicePeriods)
    .withConverter(servicePeriodConverter);

const create = async (service_period: ServicePeriod) => {
  const collRef = service_periods_collection();
  const docRef = await collRef.add({ ...service_period });
  return docRef.id;
};

const read = async (id: string) => {
  const doc = await service_periods_collection().doc(id).get();
  return doc.data();
};

const update = async (
  id: string,
  service_period: Partial<ServicePeriodDbModel>
) => {
  const writeResult = await service_periods_collection()
    .doc(id)
    .update(service_period);

  return writeResult;
};

const remove = async (id: string) => {
  await service_periods_collection().doc(id).delete();
};

const getAll = async () => {
  const snapshot = await service_periods_collection().get();
  return snapshot.docs.map((doc) => doc.data());
};

const byProgramId = async (program_id: string) => {
  const snapshot = await service_periods_collection()
    .where("program_id", "==", program_id)
    .get();
  return snapshot.docs.map((doc) => doc.data());
};

export const servicePeriodsDb = {
  create,
  read,
  update,
  remove,
  getAll,
  byProgramId,
};
