import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  ProgramArea,
  ProgramAreaAdd,
  ProgramAreaDbModel,
} from "./program-area-model";
import { db_paths, fireDb } from "../firestore.server";

// to firestore function
const programAreaToDbModel = (programArea: ProgramArea): ProgramAreaDbModel => {
  return {
    name: programArea.name,
    description: programArea.description,
    status: programArea.status,
    created_date: FieldValue.serverTimestamp(),
  };
};

// program area firesbase converter
const programAreaConverter = {
  toFirestore: programAreaToDbModel,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
      status: data.status,
      created_date: (data.created_date as Timestamp).toDate(),
    } as ProgramArea;
  },
};

const programArea_collection = () => {
  return fireDb(db_paths.programAreas).withConverter(programAreaConverter);
};

const create = async (programArea: ProgramAreaAdd) => {
  const programAreaCollRef = programArea_collection();

  const programAreaData = {
    ...programArea,
    id: "",
    created_date: FieldValue.serverTimestamp(),
  };

  const docRef = await programAreaCollRef.add(programAreaData);
  return docRef.id;
};

const read = async (id: string) => {
  const programAreaCollRef = programArea_collection();
  const docRef = await programAreaCollRef.doc(id).get();
  return docRef.data() as ProgramArea | undefined;
};

const update = async (id: string, programArea: Partial<ProgramAreaDbModel>) => {
  const programAreaCollRef = programArea_collection();
  await programAreaCollRef.doc(id).update(programArea);
};

const remove = async (id: string) => {
  const programAreaCollRef = programArea_collection();
  await programAreaCollRef.doc(id).delete();
};

const getAll = async () => {
  const programAreaCollRef = programArea_collection();
  const snapshot = await programAreaCollRef.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const test = data.created_date;
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      status: data.status,
      created_date: data.created_date,
    };
  });
};

export const programAreaDb = {
  create,
  read,
  update,
  remove,
  getAll,
};
