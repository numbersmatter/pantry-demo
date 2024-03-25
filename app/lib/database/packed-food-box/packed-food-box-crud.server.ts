import {
  DocumentData,
  FirestoreDataConverter,
  Timestamp,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";
import {
  PackedFoodBox,
  PackedFoodBoxDbModel,
} from "./types/packed-food-box-model";
import { cis_t_Db } from "../firestore.server";

function packedFoodBoxtoDbModel(
  packedFoodBox: PackedFoodBox
): PackedFoodBoxDbModel {
  return {
    ...packedFoodBox,
    date_packed: Timestamp.fromDate(packedFoodBox.date_packed),
  };
}

// firestore data converter
const packedFoodBoxConverter: FirestoreDataConverter<PackedFoodBox> = {
  toFirestore(packedFoodBox: PackedFoodBox): DocumentData {
    return packedFoodBoxtoDbModel(packedFoodBox);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): PackedFoodBox {
    const data = snapshot.data() as PackedFoodBoxDbModel;

    return {
      ...data,
      id: snapshot.id,
      date_packed: data.date_packed.toDate(),
    };
  },
};

const packedFoodBoxCollection = () =>
  getFirestore()
    .collection(cis_t_Db.packedFoodBoxes)
    .withConverter(packedFoodBoxConverter);

const create = async (packedFoodBox: PackedFoodBox): Promise<string> => {
  const packedFoodBoxCollRef = packedFoodBoxCollection();
  const docRef = await packedFoodBoxCollRef.add(packedFoodBox);
  return docRef.id;
};

const read = async (id: string) => {
  const packedFoodBoxCollRef = packedFoodBoxCollection();
  const docRef = await packedFoodBoxCollRef.doc(id).get();
  return docRef.data();
};

const update = async (
  id: string,
  packedFoodBox: Partial<PackedFoodBoxDbModel>
) => {
  const packedFoodBoxCollRef = packedFoodBoxCollection();
  await packedFoodBoxCollRef.doc(id).update(packedFoodBox);
};

const remove = async (id: string) => {
  const packedFoodBoxCollRef = packedFoodBoxCollection();
  await packedFoodBoxCollRef.doc(id).delete();
};

export const PackedFoodBoxDb = {
  create,
  read,
  update,
  remove,
};
