import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action, memberId, eventId } = await request.json()

    // Mock SMS service - return success for demo
    switch (action) {
      case 'send_recommendations':
        console.log('📱 Mock: Recommendation SMS notifications sent')
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Recommendation notifications sent' 
        })

      case 'send_event_notification':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        console.log(`📱 Mock: Event notification SMS sent to member ${memberId} for event ${eventId}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: SMS sent successfully' 
        })

      case 'send_reminder':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        console.log(`📱 Mock: Event reminder SMS sent to member ${memberId} for event ${eventId}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Reminder sent successfully' 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in SMS notification API:', error)
    return NextResponse.json(
      { error: 'Failed to process SMS notification' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      service: 'SMS Notifications (Mock)',
      configured: true,
      mode: 'demo',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Service check failed' }, 
      { status: 500 }
    )
  }
}