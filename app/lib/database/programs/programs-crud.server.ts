import { cis_t_Db, fireDb } from "../firestore.server";
import { Program, ProgramDbModel } from "./types";

const programsToDbModel = (program: Program): ProgramDbModel => {
  return {
    program_area_id: program.program_area_id,
    name: program.name,
    criteria: program.criteria,
  };
};

// program firebase converter
const programConverter = {
  toFirestore: programsToDbModel,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      program_area_id: data.program_area,
      name: data.name,
      criteria: data.criteria,
    } as Program;
  },
};

const program_collection = () => {
  return fireDb(cis_t_Db.programs).withConverter(programConverter);
};

const create = async (program: Program) => {
  const programCollRef = program_collection();
  const docRef = await programCollRef.add(program);
  return docRef.id;
};

const read = async (id: string) => {
  const programCollRef = program_collection();
  const docRef = await programCollRef.doc(id).get();
  return docRef.data();
};

const update = async (id: string, program: Partial<ProgramDbModel>) => {
  const programCollRef = program_collection();
  await programCollRef.doc(id).update(program);
};

const remove = async (id: string) => {
  const programCollRef = program_collection();
  await programCollRef.doc(id).delete();
};

const getAll = async () => {
  const programCollRef = program_collection();
  const snapshot = await programCollRef.get();
  return snapshot.docs.map((doc) => doc.data());
};

const queryBy = async (field: keyof Program, value: string) => {
  const programCollRef = program_collection();
  const snapshot = await programCollRef.where(field, "==", value).get();
  return snapshot.docs.map((doc) => doc.data());
};

export const programsDb = {
  create,
  read,
  update,
  remove,
  getAll,
  queryBy,
};
