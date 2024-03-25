import {
  DocumentData,
  FirestoreDataConverter,
  Timestamp,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";
import { db_paths } from "../firestore.server";
import { FamilyAdd, FamilyAppModel, FamilyDbModel } from "./types";

const familyToDbModel = (family: FamilyAppModel): FamilyDbModel => {
  const { id, ...rest } = family;
  return {
    ...rest,
    created_date: Timestamp.fromDate(family.created_date),
  };
};

const familyConverter: FirestoreDataConverter<FamilyAppModel> = {
  toFirestore(family: FamilyAppModel): DocumentData {
    return familyToDbModel(family);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): FamilyAppModel {
    const data = snapshot.data() as FamilyDbModel;
    return {
      ...data,
      id: snapshot.id,
      created_date: data.created_date.toDate(),
    };
  },
};

const familyCollection = () =>
  getFirestore().collection(db_paths.families).withConverter(familyConverter);

const create = async (family: FamilyAdd): Promise<string> => {
  const data = {
    ...family,
    id: "",
    created_date: new Date(),
  };
  const familyCollRef = familyCollection();
  const docRef = await familyCollRef.add(data);
  return docRef.id;
};

const read = async (id: string) => {
  const familyCollRef = familyCollection();
  const docRef = await familyCollRef.doc(id).get();
  return docRef.data();
};

const update = async (id: string, family: Partial<FamilyDbModel>) => {
  const familyCollRef = familyCollection();
  await familyCollRef.doc(id).update(family);
};

const getAll = async () => {
  const familyCollRef = familyCollection();
  const querySnapshot = await familyCollRef.get();
  return querySnapshot.docs.map((doc) => doc.data());
};

export const familyDb = {
  create,
  read,
  update,
  getAll,
};
