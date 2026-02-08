import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later."  },
        { status: 503 }
      );
    }

    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const baseUsername = name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") || "user";
    let username = baseUsername;
    let counter = 1;
    while (await usersCollection.findOne({ username })) {
      username = `${baseUsername}${counter++}`;
    }

    const newUser = {
      email,
      password: hashedPassword,
      name,
      username,
      role: "user",
      plan: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
