import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Demo mode - return sample forms data
    const forms = [
      {
        id: '1',
        userId: 'user-1',
        title: 'Customer Feedback',
        description: 'Help us improve by sharing your feedback',
        fields: [
          { id: '1', label: 'Name', type: 'text', required: true },
          { id: '2', label: 'Email', type: 'email', required: true },
          { id: '3', label: 'Rating', type: 'select', required: true, options: ['1', '2', '3', '4', '5'] },
          { id: '4', label: 'Comments', type: 'textarea', required: false },
        ],
        shareUrl: 'https://ayush.app/forms/1',
        responses: 12,
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ forms })
  } catch (error) {
    console.error('Get forms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, fields } = await request.json()

    if (!title || !fields) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Demo mode - create new form
    const newForm = {
      id: Date.now().toString(),
      userId: 'user-1',
      title,
      description,
      fields,
      shareUrl: `https://ayush.app/forms/${Date.now()}`,
      responses: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, form: newForm })
  } catch (error) {
    console.error('Create form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
