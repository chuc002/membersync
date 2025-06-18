import { NextRequest, NextResponse } from 'next/server'
import { smsService } from '@/lib/notifications/sms'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authenticated
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.SYNC_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, memberId, eventId } = await request.json()

    switch (action) {
      case 'send_recommendations':
        await smsService.notifyNewRecommendedEvents()
        return NextResponse.json({ 
          success: true, 
          message: 'Recommendation notifications sent' 
        })

      case 'send_event_notification':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        const supabase = createClient()
        
        const { data: member } = await supabase
          .from('members')
          .select('*')
          .eq('id', memberId)
          .single()
          
        const { data: event } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (!member || !event) {
          return NextResponse.json({ error: 'Member or event not found' }, { status: 404 })
        }

        const sent = await smsService.sendEventNotification(member, event)
        return NextResponse.json({ 
          success: sent, 
          message: sent ? 'SMS sent successfully' : 'SMS not sent (preferences or phone missing)' 
        })

      case 'send_reminder':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        const supabaseReminder = createClient()
        
        const { data: memberReminder } = await supabaseReminder
          .from('members')
          .select('*')
          .eq('id', memberId)
          .single()
          
        const { data: eventReminder } = await supabaseReminder
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (!memberReminder || !eventReminder) {
          return NextResponse.json({ error: 'Member or event not found' }, { status: 404 })
        }

        const reminderSent = await smsService.sendEventReminder(memberReminder, eventReminder)
        return NextResponse.json({ 
          success: reminderSent, 
          message: reminderSent ? 'Reminder sent successfully' : 'Reminder not sent (preferences or phone missing)' 
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
    // Simple health check for SMS service
    const isConfigured = Boolean(
      process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_PHONE_NUMBER
    )

    return NextResponse.json({
      service: 'SMS Notifications',
      configured: isConfigured,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Service check failed' }, 
      { status: 500 }
    )
  }
}