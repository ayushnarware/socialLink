import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Check if MongoDB is configured
export function isMongoDBConfigured(): boolean {
  return !!process.env.MONGODB_URI
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve the connection
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production, create a new client
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("MongoDB not configured. Please add MONGODB_URI to environment variables.")
  }
  const client = await clientPromise
  return client.db("ayush")
}

// Collection types
export interface User {
  _id?: string
  email: string
  password: string
  name: string
  role: "user" | "admin"
  plan: "free" | "pro" | "business"
  planExpiry?: Date
  createdAt: Date
  updatedAt: Date
  avatar?: string
  username?: string
  bio?: string
}

export interface Link {
  _id?: string
  userId: string
  title: string
  url: string
  type: "link" | "button" | "card" | "video" | "music" | "social"
  icon?: string
  visible: boolean
  order: number
  clicks: number
  createdAt: Date
  updatedAt: Date
}

export interface PageSettings {
  _id?: string
  userId: string
  theme: string
  customColors?: {
    background: string
    text: string
    accent: string
  }
  font?: string
  backgroundImage?: string
  animatedBackground?: "none" | "snow" | "smoke" | "waves" | "hyperspace"
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  customDomain?: string
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  _id?: string
  userId: string
  linkId?: string
  type: "view" | "click" | "qr_scan"
  device: string
  browser: string
  os: string
  country?: string
  city?: string
  referrer?: string
  timestamp: Date
}
