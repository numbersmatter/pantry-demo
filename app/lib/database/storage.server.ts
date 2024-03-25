import { getStorage } from "firebase-admin/storage";
import { Storage } from "@google-cloud/storage";

const serviceAccount = process.env.SERVICE_ACCOUNT;
if (!serviceAccount) {
  throw new Error("Missing SERVICE_ACCOUNT environment variable");
}

// Creates a client
const storage = new Storage({
  projectId: "vertical-hydration",
  credentials: JSON.parse(serviceAccount),
});

const images = storage.bucket("files");

images.upload("test");

const bucket = getStorage().bucket();

bucket.file("test").createWriteStream();
