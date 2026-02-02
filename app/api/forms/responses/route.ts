import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { formId, responseData } = await request.json()

    if (!formId || !responseData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Demo mode - store response
    const newResponse = {
      id: Date.now().toString(),
      formId,
      data: responseData,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, response: newResponse })
  } catch (error) {
    console.error('Submit form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('formId')

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID required' },
        { status: 400 }
      )
    }

    // Demo mode - return sample responses
    const responses = [
      {
        id: '1',
        formId,
        data: { name: 'John Doe', email: 'john@example.com', rating: '5', comments: 'Great service!' },
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        formId,
        data: { name: 'Jane Smith', email: 'jane@example.com', rating: '4', comments: 'Good experience' },
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Get responses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
