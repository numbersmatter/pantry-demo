import { Timestamp } from "firebase-admin/firestore";
import { ProgramArea, ProgramAreaDbModel } from "./program-area-model";
import { cis_t_Db, fireDb } from "../firestore.server";

// to firestore function
const programAreaToDbModel = (programArea: ProgramArea): ProgramAreaDbModel => {
  return {
    name: programArea.name,
    description: programArea.description,
    status: programArea.status,
    created_date: Timestamp.fromDate(programArea.created_date),
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
  return fireDb(cis_t_Db.programAreas).withConverter(programAreaConverter);
};

const create = async (programArea: ProgramArea) => {
  const programAreaCollRef = programArea_collection();
  const docRef = await programAreaCollRef.add(programArea);
  return docRef.id;
};

const read = async (id: string) => {
  const programAreaCollRef = programArea_collection();
  const docRef = await programAreaCollRef.doc(id).get();
  return docRef.data();
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
  return snapshot.docs.map((doc) => doc.data());
};

export const programAreaDb = {
  create,
  read,
  update,
  remove,
  getAll,
};
