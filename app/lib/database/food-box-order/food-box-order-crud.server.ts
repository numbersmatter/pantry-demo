import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";
import {
  FoodBoxOrder,
  FoodBoxOrderDbModel,
} from "./types/food-box-order-model";
import { db_paths } from "../firestore.server";

// converter to firestore

// firestore data converter
const foodBoxDataConverter: FirestoreDataConverter<FoodBoxOrder> = {
  toFirestore: (foodBoxOrder: FoodBoxOrder) => {
    const { id, ...data } = foodBoxOrder;
    return data;
  },
  fromFirestore(snap: QueryDocumentSnapshot): FoodBoxOrder {
    const data = snap.data() as FoodBoxOrderDbModel;
    const { id } = snap;
    return {
      ...data,
      id,
    };
  },
};

const foodBoxOrderCollection = () =>
  getFirestore()
    .collection(db_paths.foodBoxOrders)
    .withConverter(foodBoxDataConverter);

const create = async (foodBoxOrder: FoodBoxOrder): Promise<string> => {
  const foodBoxCollRef = foodBoxOrderCollection();
  const docRef = await foodBoxCollRef.add(foodBoxOrder);
  return docRef.id;
};

const read = async (id: string) => {
  const foodBoxCollRef = foodBoxOrderCollection();
  const docRef = await foodBoxCollRef.doc(id).get();
  return docRef.data();
};

const update = async (id: string, foodBoxOrder: Partial<FoodBoxOrder>) => {
  const foodBoxCollRef = foodBoxOrderCollection();
  await foodBoxCollRef.doc(id).update(foodBoxOrder);
};

const remove = async (id: string) => {
  const foodBoxCollRef = foodBoxOrderCollection();
  await foodBoxCollRef.doc(id).delete();
};

export const FoodBoxOrderDb = {
  create,
  read,
  update,
  remove,
};
