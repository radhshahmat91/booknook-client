
import { setServers } from "node:dns";
import { MongoClient } from "mongodb";

// Configure DNS before MongoDB performs SRV lookups.
setServers(["1.1.1.1", "8.8.8.8"]);

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const dbName = process.env.MONGODB_DB || "booknook";

const options = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
};

const globalForMongo = globalThis as typeof globalThis & {
  _booknookMongo?: MongoClient;
};

const client =
  globalForMongo._booknookMongo ??
  new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._booknookMongo = client;
}

// MongoDB Db handle. The driver connects automatically
// when Better Auth performs its first database operation.
export const db = client.db(dbName);

export default client;
