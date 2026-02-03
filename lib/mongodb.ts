import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient: MongoClient | null = null;

export async function getDatabase() {
  if (!MONGODB_URI) {
    return null;
  }

  if (cachedClient) {
    return cachedClient.db();
  }

  const client = new MongoClient(MONGODB_URI);
  cachedClient = client;

  await client.connect();
  return client.db();
}