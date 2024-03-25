import {
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { Seat, SeatAdd, SeatDbModel } from "./types/seats-model";
import { cis_t_Db } from "../firestore.server";
import { Feather } from "lucide-react";

// function toFirestore

function seatToDbModel(seat: Seat): SeatDbModel {
  const data = {
    ...seat,
    created_date: Timestamp.fromDate(seat.created_date),
    updated_date: Timestamp.fromDate(seat.updated_date),
    enrolled_date: Timestamp.fromDate(seat.enrolled_date),
  };

  if (seat.unenrolled_date) {
    return {
      ...data,
      unenrolled_date: Timestamp.fromDate(seat.unenrolled_date),
    };
  }

  const { unenrolled_date, ...rest } = data;

  return {
    ...rest,
  };
}

// Firestore data converter
const seatConverter: FirestoreDataConverter<Seat> = {
  toFirestore(seats: Seat): DocumentData {
    return seatToDbModel(seats);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Seat {
    const data = snapshot.data() as SeatDbModel;
    return {
      ...data,
      id: snapshot.id,
      created_date: data.created_date.toDate(),
      updated_date: data.updated_date.toDate(),
      enrolled_date: data.enrolled_date.toDate(),
      unenrolled_date: data.unenrolled_date?.toDate(),
    };
  },
};

const seats_collection = () =>
  getFirestore().collection(cis_t_Db.seats).withConverter(seatConverter);

const create = async (seat: SeatAdd) => {
  const colRef = seats_collection();
  const data = {
    ...seat,
    id: "",
    created_date: new Date(),
    updated_date: new Date(),
    enrolled_date: new Date(),
  };
  const docRef = await colRef.add(data);
  return docRef.id;
};

const read = async (id: string) => {
  const doc = await seats_collection().doc(id).get();
  return doc.data();
};

const update = async (id: string, seat: Partial<SeatDbModel>) => {
  const writeResult = await seats_collection().doc(id).update(seat);
  return writeResult;
};

const remove = async (id: string) => {
  await seats_collection().doc(id).delete();
};

const queryByString = async (field: keyof Seat, value: string) => {
  const querySnapshot = await seats_collection()
    .where(field, "==", value)
    .get();

  return querySnapshot.docs.map((doc) => doc.data());
};

// TODO: if no value is passed, return all seats
const query = async () => {
  const querySnapshot = await seats_collection().get();
  return querySnapshot.docs.map((doc) => doc.data());
};

export const seatsDb = {
  create,
  read,
  update,
  remove,
  queryByString,
  query,
};
