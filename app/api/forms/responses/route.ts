import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { formId, responseData } = await request.json()

    if (!formId || !responseData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const form = await db.collection("forms").findOne({ _id: new ObjectId(formId) })
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const newResponse = {
      formId,
      data: responseData,
      timestamp: new Date(),
    }

    await db.collection("formResponses").insertOne(newResponse)

    return NextResponse.json({
      success: true,
      response: {
        id: newResponse.formId,
        formId,
        data: responseData,
        timestamp: newResponse.timestamp.toISOString(),
      },
    })
  } catch (error) {
    console.error("Submit form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const formId = searchParams.get("formId")

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const form = await db.collection("forms").findOne({ _id: new ObjectId(formId), userId })
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const responses = await db
      .collection("formResponses")
      .find({ formId })
      .sort({ timestamp: -1 })
      .toArray()

    return NextResponse.json({
      responses: responses.map((r: { _id: ObjectId; formId: string; data: unknown; timestamp: Date }) => ({
        id: r._id.toString(),
        formId: r.formId,
        data: r.data,
        timestamp: r.timestamp?.toISOString?.() || new Date().toISOString(),
      })),
    })
  } catch (error) {
    console.error("Get responses error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
