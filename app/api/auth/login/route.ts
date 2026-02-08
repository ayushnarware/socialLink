import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later." },
        { status: 503 }
      );
    }

    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Prepare user data to return (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });

    // Set token in an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
