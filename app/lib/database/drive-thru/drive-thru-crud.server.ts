import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { db_paths } from "../firestore.server";
import {
  DriveThruDbAddModel,
  DriveThruForm,
  DriveThruFormDbModel,
} from "./types";

const driveThru_collection = getFirestore().collection(
  "/nonprofits/cist/drive_thru"
);

const read = async (id: string) => {
  const doc = await driveThru_collection.doc(id).get();
  return doc.data();
};

const create = async (data: DriveThruDbAddModel) => {
  const writeData = {
    ...data,
    created_date: FieldValue.serverTimestamp(),
    updated_date: FieldValue.serverTimestamp(),
  };
  const doc = await driveThru_collection.add(writeData);
  return doc.id;
};

const getAll = async () => {
  const query = await driveThru_collection.get();
  const data: DriveThruForm[] = [];
  query.forEach((doc) => {
    data.push({
      ...doc.data(),
      id: doc.id,
      created_date: doc.data().created_date.toDate(),
      updated_date: doc.data().updated_date.toDate(),
    } as DriveThruForm);
  });
  return data;
};

const afterDate = async (date: Date) => {
  const query = await driveThru_collection
    .where("created_date", ">=", date)
    .get();
  const data: DriveThruForm[] = [];
  query.forEach((doc) => {
    data.push({
      ...doc.data(),
      id: doc.id,
      created_date: doc.data().created_date.toDate(),
      updated_date: doc.data().updated_date.toDate(),
    } as DriveThruForm);
  });
  return data;
};

interface UpdateFormNumber {
  formID: string;
  fieldID: string;
  value: number;
}

const updateFormNumber = async (updateData: UpdateFormNumber) => {
  const updateField = `form_responses.${updateData.fieldID}`;

  const doc = await driveThru_collection.doc(updateData.formID).update({
    [updateField]: updateData.value,
    updated_date: FieldValue.serverTimestamp(),
  });
  return doc;
};

const updateFormNotes = async (formID: string, notes: string) => {
  const doc = await driveThru_collection.doc(formID).update({
    "form_responses.notes": notes,
    updated_date: FieldValue.serverTimestamp(),
  });
  return doc;
};

export const driveFormDb = {
  read,
  create,
  getAll,
  updateFormNumber,
  updateFormNotes,
  afterDate,
};
