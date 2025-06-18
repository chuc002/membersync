import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action, memberId, eventId } = await request.json()

    // Mock email service - return success for demo
    switch (action) {
      case 'send_welcome':
        if (!memberId) {
          return NextResponse.json({ error: 'Missing memberId' }, { status: 400 })
        }
        
        console.log(`📧 Mock: Welcome email sent to member ${memberId}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Welcome email sent' 
        })

      case 'send_event_notification':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        console.log(`📧 Mock: Event notification email sent to member ${memberId} for event ${eventId}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Event notification sent' 
        })

      case 'send_registration_confirmation':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        console.log(`📧 Mock: Registration confirmation email sent to member ${memberId} for event ${eventId}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Registration confirmation sent' 
        })

      case 'send_reminder':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        console.log(`📧 Mock: Event reminder email sent to member ${memberId} for event ${eventId}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Reminder sent' 
        })

      case 'send_recommendations':
        console.log('📧 Mock: Recommendation emails sent to all eligible members')
        return NextResponse.json({ 
          success: true, 
          message: 'Mock: Recommendation emails sent to eligible members' 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in email notification API:', error)
    return NextResponse.json(
      { error: 'Failed to process email notification' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      service: 'Email Notifications (Mock)',
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