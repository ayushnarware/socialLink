import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // If token is invalid, clear it
      const response = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      response.cookies.set("token", "", { maxAge: -1 });
      return response;
    }

    const userId = (decoded as any).userId;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const db = await getDatabase();
    if (!db) {
        return NextResponse.json(
            { error: "Internal Database Server Error. Please try again later." },
            { status: 500 }
        );
    }
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      // If user not found, clear the invalid cookie
      const response = NextResponse.json({ error: "User not found" }, { status: 404 });
      response.cookies.set("token", "", { maxAge: -1 });
      return response;
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error("Get user error:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    // Also clear cookie on internal errors
    response.cookies.set("token", "", { maxAge: -1 });
    return response;
  }
}
