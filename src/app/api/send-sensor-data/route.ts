import { NextRequest, NextResponse } from 'next/server'

// Internal storage for latest sensor data
let latestStatus = {
  connected: false,
  time: 'N/A',
  ph: 'N/A',
  turbid: 'N/A',
}

// GET: Called by the frontend to fetch latest sensor data
export async function GET() {
  return NextResponse.json(latestStatus)
}

// POST: Called by Arduino or external device to send sensor data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { connected, time, ph, turbid } = body

    // Validate incoming data
    if (
      typeof connected !== 'boolean' ||
      typeof time !== 'string' ||
      typeof ph !== 'string' ||
      typeof turbid !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid payload format' },
        { status: 400 }
      )
    }

    // Save the latest values
    latestStatus = {
      connected,
      time,
      ph,
      turbid,
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
