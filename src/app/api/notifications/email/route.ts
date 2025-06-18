import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/notifications/email'
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
      case 'send_welcome':
        if (!memberId) {
          return NextResponse.json({ error: 'Missing memberId' }, { status: 400 })
        }
        
        const supabaseWelcome = createClient()
        const { data: member } = await supabaseWelcome
          .from('members')
          .select('*')
          .eq('id', memberId)
          .single()

        if (!member) {
          return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        const welcomeSent = await emailService.sendWelcomeEmail(member)
        return NextResponse.json({ 
          success: welcomeSent, 
          message: welcomeSent ? 'Welcome email sent' : 'Failed to send welcome email' 
        })

      case 'send_event_notification':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        const supabase = createClient()
        
        const { data: memberEvent } = await supabase
          .from('members')
          .select('*')
          .eq('id', memberId)
          .single()
          
        const { data: event } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (!memberEvent || !event) {
          return NextResponse.json({ error: 'Member or event not found' }, { status: 404 })
        }

        const notificationSent = await emailService.sendEventNotification(memberEvent, event)
        return NextResponse.json({ 
          success: notificationSent, 
          message: notificationSent ? 'Event notification sent' : 'Notification not sent (preferences disabled)' 
        })

      case 'send_registration_confirmation':
        if (!memberId || !eventId) {
          return NextResponse.json({ error: 'Missing memberId or eventId' }, { status: 400 })
        }
        
        const supabaseReg = createClient()
        
        const { data: memberReg } = await supabaseReg
          .from('members')
          .select('*')
          .eq('id', memberId)
          .single()
          
        const { data: eventReg } = await supabaseReg
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (!memberReg || !eventReg) {
          return NextResponse.json({ error: 'Member or event not found' }, { status: 404 })
        }

        const confirmationSent = await emailService.sendRegistrationConfirmation(memberReg, eventReg)
        return NextResponse.json({ 
          success: confirmationSent, 
          message: confirmationSent ? 'Registration confirmation sent' : 'Failed to send confirmation' 
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

        const reminderSent = await emailService.sendEventReminder(memberReminder, eventReminder)
        return NextResponse.json({ 
          success: reminderSent, 
          message: reminderSent ? 'Reminder sent' : 'Reminder not sent (preferences disabled)' 
        })

      case 'send_recommendations':
        await emailService.sendBulkRecommendations()
        return NextResponse.json({ 
          success: true, 
          message: 'Recommendation emails sent to eligible members' 
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
    // Simple health check for email service
    const isConfigured = Boolean(process.env.RESEND_API_KEY)

    return NextResponse.json({
      service: 'Email Notifications',
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