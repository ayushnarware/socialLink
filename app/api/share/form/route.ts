import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")
    const formId = url.searchParams.get("formId")

    if (!username || !formId) {
      return NextResponse.json({ error: "username and formId required" }, { status: 400 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 })
    }

    const user = await db.collection("users").findOne({ username: username.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const userId = String(user._id)
    const form = await db.collection("forms").findOne({ _id: new ObjectId(formId), userId })
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({
      form: {
        id: String(form._id),
        title: form.title,
        description: form.description || "",
        fields: form.fields || [],
      },
    })
  } catch (err) {
    console.error("Get shared form error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
