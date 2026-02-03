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

    if (token === "demo-token") {
      // Demo mode
      return NextResponse.json({
        user: { name: "Demo User", email: "demo@example.com", role: "admin", plan: "free" },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = (decoded as any).userId;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const db = await getDatabase();
    if (!db) {
        // This should not happen if the demo token is handled above, but as a fallback
        return NextResponse.json({
            user: { name: "Demo User", email: "demo@example.com", role: "admin", plan: "free" },
          });
    }
    const usersCollection = db.collection("users");

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare user data to return (excluding password)
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
