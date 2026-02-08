import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later."  },
        { status: 503 }
      )
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const forms = await db
      .collection("forms")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    const responseCounts = await db
      .collection("formResponses")
      .aggregate([
        { $match: { formId: { $in: forms.map((f: { _id: ObjectId }) => f._id.toString()) } } },
        { $group: { _id: "$formId", count: { $sum: 1 } } },
      ])
      .toArray()

    const countMap = Object.fromEntries(
      responseCounts.map((r: { _id: string; count: number }) => [r._id, r.count])
    )

    return NextResponse.json({
      forms: forms.map((form: { _id: ObjectId; userId: string; title: string; description?: string; fields: unknown[]; createdAt: Date }) => ({
        id: form._id.toString(),
        userId: form.userId,
        title: form.title,
        description: form.description || "",
        fields: form.fields || [],
        shareUrl: `/form/${user.name?.toLowerCase().replace(/\s+/g, "") || "user"}/${form._id.toString()}`,
        responses: countMap[form._id.toString()] || 0,
        createdAt: form.createdAt?.toISOString?.() || new Date().toISOString(),
      })),
    })
  } catch (error) {
    console.error("Get forms error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, fields = [] } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later."  },
        { status: 503 }
      )
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const username = user.name?.toLowerCase().replace(/\s+/g, "") || "user"

    const newForm = {
      userId,
      title,
      description: description || "",
      fields,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("forms").insertOne(newForm)
    const id = result.insertedId.toString()

    return NextResponse.json({
      success: true,
      form: {
        id,
        userId,
        title,
        description: newForm.description,
        fields,
        shareUrl: `/form/${username}/${id}`,
        responses: 0,
        createdAt: newForm.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Create form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
