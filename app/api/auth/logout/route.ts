import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    removeAuthCookie(response); // Pass the response object to the function
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
