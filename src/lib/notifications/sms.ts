import twilio from 'twilio'
import { createClient } from '@/lib/supabase/server'
import type { Member, Event } from '@/lib/types/database'

// Initialize Twilio client only if credentials are available
let twilioClient: twilio.Twilio | null = null

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  } catch (error) {
    console.warn('Failed to initialize Twilio client:', error)
  }
}

export class SMSNotificationService {
  private fromNumber = process.env.TWILIO_PHONE_NUMBER

  async sendEventNotification(member: Member, event: Event): Promise<boolean> {
    try {
      if (!twilioClient || !member.phone || !this.shouldReceiveSMS(member)) {
        return false
      }

      const message = this.formatEventNotificationMessage(member, event)
      
      await twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.formatPhoneNumber(member.phone),
      })

      console.log(`SMS sent to ${member.name} (${member.phone}) for event: ${event.title}`)
      return true
    } catch (error) {
      console.error('Error sending SMS notification:', error)
      return false
    }
  }

  async sendRecommendationNotification(member: Member, events: Event[]): Promise<boolean> {
    try {
      if (!twilioClient || !member.phone || !this.shouldReceiveSMS(member) || events.length === 0) {
        return false
      }

      const message = this.formatRecommendationMessage(member, events)
      
      await twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.formatPhoneNumber(member.phone),
      })

      console.log(`Recommendation SMS sent to ${member.name} for ${events.length} events`)
      return true
    } catch (error) {
      console.error('Error sending recommendation SMS:', error)
      return false
    }
  }

  async sendEventReminder(member: Member, event: Event): Promise<boolean> {
    try {
      if (!twilioClient || !member.phone || !this.shouldReceiveSMS(member)) {
        return false
      }

      const message = this.formatReminderMessage(member, event)
      
      await twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.formatPhoneNumber(member.phone),
      })

      console.log(`Reminder SMS sent to ${member.name} for event: ${event.title}`)
      return true
    } catch (error) {
      console.error('Error sending reminder SMS:', error)
      return false
    }
  }

  async notifyNewRecommendedEvents(): Promise<void> {
    try {
      const supabase = createClient()
      
      // Get all members with SMS notifications enabled
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .neq('phone', null)

      if (membersError || !members) {
        console.error('Error fetching members:', membersError)
        return
      }

      // Get recent events (added in last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const { data: recentEvents, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .gte('date', new Date().toISOString().split('T')[0])

      if (eventsError || !recentEvents || recentEvents.length === 0) {
        console.log('No new events to notify about')
        return
      }

      // Send notifications to eligible members
      for (const member of members) {
        if (this.shouldReceiveSMS(member)) {
          const recommendedEvents = this.getRecommendedEventsForMember(member, recentEvents)
          
          if (recommendedEvents.length > 0) {
            await this.sendRecommendationNotification(member, recommendedEvents)
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
    } catch (error) {
      console.error('Error in bulk notification process:', error)
    }
  }

  private shouldReceiveSMS(member: Member): boolean {
    const preferences = member.preferences as any
    return preferences?.notifications?.sms === true && Boolean(member.phone)
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    // Add country code if not present
    if (digits.length === 10) {
      return `+1${digits}`
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`
    }
    
    return phone // Return as-is if already formatted or unknown format
  }

  private formatEventNotificationMessage(member: Member, event: Event): string {
    const date = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    
    const time = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `Hi ${member.name}! 📅 "${event.title}" is scheduled for ${date} at ${time}. Price: $${event.price}. Register at ihcckc.com. Reply STOP to opt out.`
  }

  private formatRecommendationMessage(member: Member, events: Event[]): string {
    if (events.length === 1) {
      const event = events[0]
      const date = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      
      return `Hi ${member.name}! 🎯 New recommended event: "${event.title}" on ${date}. Perfect for your interests! Check MemberSync for details. Reply STOP to opt out.`
    } else {
      return `Hi ${member.name}! 🎯 ${events.length} new events match your interests! Check your MemberSync dashboard to see recommendations and register. Reply STOP to opt out.`
    }
  }

  private formatReminderMessage(member: Member, event: Event): string {
    const eventDate = new Date(event.date)
    const today = new Date()
    const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    const time = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    if (daysUntil === 0) {
      return `📅 Reminder: "${event.title}" is TODAY at ${time}! Don't forget to attend. See you there!`
    } else if (daysUntil === 1) {
      return `📅 Reminder: "${event.title}" is TOMORROW at ${time}! Looking forward to seeing you there.`
    } else {
      return `📅 Reminder: "${event.title}" is in ${daysUntil} days at ${time}. Mark your calendar!`
    }
  }

  private getRecommendedEventsForMember(member: Member, events: Event[]): Event[] {
    const preferences = member.preferences as any
    const preferredCategories = preferences?.categories || []
    const familyEventsEnabled = preferences?.familyEvents === true

    return events.filter(event => {
      // Check if event category matches preferences
      if (preferredCategories.includes(event.category)) {
        return true
      }
      
      // Include family events if enabled
      if (familyEventsEnabled && (event.category === 'Kids' || event.category === 'Social')) {
        return true
      }
      
      return false
    })
  }
}

export const smsService = new SMSNotificationService()