import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDatabase() {
  if (!MONGODB_URI) {
    return null;
  }

  // If we have a cached connection that is active, reuse it.
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  try {
    // If there is no cached client, or the connection was lost, create a new one.
    const client = new MongoClient(MONGODB_URI);
    cachedClient = client;

    await client.connect();
    
    // The DB name is part of the connection string
    const db = client.db();
    cachedDb = db;
    
    return db;
  } catch (error) {
    // If connection fails, we must nullify the cache
    // to allow a new connection attempt on the next request.
    cachedClient = null; 
    cachedDb = null;
    
    console.error("MongoDB connection error:", error);
    // Re-throw the error so the calling function can handle it
    throw error;
  }
}
