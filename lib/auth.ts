
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface JWTPayload {
  userId: string;
  role: "user" | "admin" | "super-admin";
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export function removeAuthCookie(res: NextResponse): void {
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Expire immediately
    path: "/",
  });
}

export function getAuthToken(req: NextRequest): string | null {
  return req.cookies.get("token")?.value || null;
}

export async function getCurrentUser() {

  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
    // const token = cookies().get("token")?.value;
  
    if (!token) {
      return null;
    }
  
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      console.error("Invalid token for getCurrentUser", error);
      return null;
    }
  
    const { userId } = decoded;
  
    if (!userId) {
      return null;
    }
  
    const db = await getDatabase();
    if (!db) {
        return null; // Database not available
    }

    const usersCollection = db.collection("users");
  
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
        if (!user) {
          return null;
        }
    
        // Exclude password before returning
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
  }
  