import { NextRequest, NextResponse } from 'next/server'

let latestStatus = {
  connected: false,
  time: 'N/A',
  ph: 'N/A',
  turbid: 'N/A',
  lastUpdated: 'Never',
}

// GET: Client fetches the latest status and sensor values
export async function GET() {
  return NextResponse.json(latestStatus)
}

// POST: Arduino sends connection + sensor data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { connected, time, ph, turbid } = body

    // Validate payload
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

    // Update latest status
    latestStatus = {
      connected,
      time,
      ph,
      turbid,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, status: latestStatus })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
