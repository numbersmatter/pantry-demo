import { FirestoreDataConverter, getFirestore } from "firebase-admin/firestore";
import { WeekPlan, WeekPlanBase, WeekPlanDBModel } from "./types";
import { db_paths } from "../firestore.server";

function weekplanToDbModel(weekplan: WeekPlan): WeekPlanDBModel {
  const { id, ...rest } = weekplan;
  return {
    ...rest,
  };
}

const weekplanConverter: FirestoreDataConverter<WeekPlan> = {
  toFirestore(weekplan: WeekPlan): WeekPlanDBModel {
    return weekplanToDbModel(weekplan);
  },
  fromFirestore(snapshot): WeekPlan {
    const data = snapshot.data() as WeekPlanDBModel;
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

const weekplanCollection = () =>
  getFirestore().collection(db_paths.weekplan).withConverter(weekplanConverter);

const readWeekPlan = async (id: string): Promise<WeekPlan | undefined> => {
  const doc = await weekplanCollection().doc(id).get();
  return doc.exists ? doc.data() : undefined;
};

const createWeekPlan = async (weekplan: WeekPlanBase): Promise<WeekPlan> => {
  const colRef = weekplanCollection();
  const docRef = colRef.doc();
  const data = {
    ...weekplan,
    id: docRef.id,
  };
  await docRef.set(data);
  return data;
};

export const weekPlanDb = {
  read: readWeekPlan,
  create: createWeekPlan,
};
