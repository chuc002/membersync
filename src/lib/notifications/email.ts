import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import type { Member, Event } from '@/lib/types/database'

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailNotificationService {
  private fromEmail = 'MemberSync <notifications@membersync.com>'

  async sendWelcomeEmail(member: Member): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [member.email],
        subject: 'Welcome to MemberSync - Your IHCC Event Portal',
        html: this.generateWelcomeEmailHTML(member),
      })

      if (error) {
        console.error('Error sending welcome email:', error)
        return false
      }

      console.log(`Welcome email sent to ${member.email}`)
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  async sendEventNotification(member: Member, event: Event): Promise<boolean> {
    try {
      if (!this.shouldReceiveEmail(member)) {
        return false
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [member.email],
        subject: `New Event: ${event.title} - IHCC`,
        html: this.generateEventNotificationHTML(member, event),
      })

      if (error) {
        console.error('Error sending event notification:', error)
        return false
      }

      console.log(`Event notification sent to ${member.email} for: ${event.title}`)
      return true
    } catch (error) {
      console.error('Error sending event notification:', error)
      return false
    }
  }

  async sendRegistrationConfirmation(member: Member, event: Event): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [member.email],
        subject: `Registration Confirmed: ${event.title}`,
        html: this.generateRegistrationConfirmationHTML(member, event),
      })

      if (error) {
        console.error('Error sending registration confirmation:', error)
        return false
      }

      console.log(`Registration confirmation sent to ${member.email} for: ${event.title}`)
      return true
    } catch (error) {
      console.error('Error sending registration confirmation:', error)
      return false
    }
  }

  async sendEventReminder(member: Member, event: Event): Promise<boolean> {
    try {
      if (!this.shouldReceiveEmail(member)) {
        return false
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [member.email],
        subject: `Reminder: ${event.title} - Tomorrow`,
        html: this.generateEventReminderHTML(member, event),
      })

      if (error) {
        console.error('Error sending event reminder:', error)
        return false
      }

      console.log(`Event reminder sent to ${member.email} for: ${event.title}`)
      return true
    } catch (error) {
      console.error('Error sending event reminder:', error)
      return false
    }
  }

  async sendRecommendationDigest(member: Member, events: Event[]): Promise<boolean> {
    try {
      if (!this.shouldReceiveEmail(member) || events.length === 0) {
        return false
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [member.email],
        subject: 'Your Recommended Events This Week - IHCC',
        html: this.generateRecommendationDigestHTML(member, events),
      })

      if (error) {
        console.error('Error sending recommendation digest:', error)
        return false
      }

      console.log(`Recommendation digest sent to ${member.email} with ${events.length} events`)
      return true
    } catch (error) {
      console.error('Error sending recommendation digest:', error)
      return false
    }
  }

  async sendBulkRecommendations(): Promise<void> {
    try {
      const supabase = createClient()
      
      // Get all members with email notifications enabled
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')

      if (membersError || !members) {
        console.error('Error fetching members:', membersError)
        return
      }

      // Get upcoming events
      const { data: upcomingEvents, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (eventsError || !upcomingEvents) {
        console.error('Error fetching events:', eventsError)
        return
      }

      // Send recommendations to eligible members
      for (const member of members) {
        if (this.shouldReceiveEmail(member)) {
          const recommendedEvents = this.getRecommendedEventsForMember(member, upcomingEvents)
          
          if (recommendedEvents.length > 0) {
            await this.sendRecommendationDigest(member, recommendedEvents)
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
    } catch (error) {
      console.error('Error in bulk email process:', error)
    }
  }

  private shouldReceiveEmail(member: Member): boolean {
    const preferences = member.preferences as any
    return preferences?.notifications?.email !== false // Default to true if not set
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
    }).slice(0, 5) // Limit to 5 events per email
  }

  private generateWelcomeEmailHTML(member: Member): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MemberSync</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .feature { padding: 15px; background: #f8f9fa; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to MemberSync!</h1>
              <p>Your personal gateway to IHCC events and activities</p>
            </div>
            
            <div class="content">
              <h2>Hello ${member.name}!</h2>
              
              <p>Welcome to MemberSync, your personalized portal for Indian Hills Country Club events and activities. We're excited to help you discover and participate in club events that match your interests.</p>
              
              <div class="features">
                <div class="feature">
                  <h3>🎯 Personalized Recommendations</h3>
                  <p>Get event suggestions based on your preferences</p>
                </div>
                <div class="feature">
                  <h3>👨‍👩‍👧‍👦 Family Management</h3>
                  <p>Register family members for events seamlessly</p>
                </div>
                <div class="feature">
                  <h3>📱 Smart Notifications</h3>
                  <p>Stay updated with email and SMS alerts</p>
                </div>
                <div class="feature">
                  <h3>📅 Event Calendar</h3>
                  <p>View all upcoming club events in one place</p>
                </div>
              </div>
              
              <p>Ready to get started? Log in to your dashboard to explore upcoming events and set your preferences.</p>
              
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Visit Your Dashboard</a>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Set your event preferences to receive personalized recommendations</li>
                <li>Add family members to register them for events</li>
                <li>Browse upcoming events and register for ones that interest you</li>
                <li>Enable notifications to stay informed about new events</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Indian Hills Country Club • Kansas City<br>
              Questions? Contact us at <a href="mailto:support@ihcckc.com">support@ihcckc.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateEventNotificationHTML(member: Member, event: Event): string {
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    
    const eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Event: ${event.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .event-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .category { display: inline-block; background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Event Available!</h1>
              <p>An event matching your interests has been added</p>
            </div>
            
            <div class="content">
              <h2>Hello ${member.name}!</h2>
              
              <p>We've added a new event that we think you'll love:</p>
              
              <div class="event-details">
                <span class="category">${event.category}</span>
                <h3>${event.title}</h3>
                <p><strong>📅 Date:</strong> ${eventDate}</p>
                <p><strong>🕐 Time:</strong> ${eventTime}</p>
                <p><strong>💰 Price:</strong> $${event.price}</p>
                <p><strong>📝 Description:</strong></p>
                <p>${event.description}</p>
              </div>
              
              <p>Ready to join us? Click below to register:</p>
              
              <a href="${event.registration_url}" class="button">Register Now</a>
              
              <p><small>You're receiving this because this event matches your preferences. You can update your notification settings in your MemberSync dashboard.</small></p>
            </div>
            
            <div class="footer">
              <p>Indian Hills Country Club • Kansas City<br>
              <a href="${process.env.NEXTAUTH_URL}/dashboard">Manage Preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateRegistrationConfirmationHTML(member: Member, event: Event): string {
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    
    const eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Confirmed: ${event.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 14px; }
            .confirmation { background: #e8f5e8; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4caf50; }
            .event-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Registration Confirmed!</h1>
              <p>You're all set for ${event.title}</p>
            </div>
            
            <div class="content">
              <h2>Hello ${member.name}!</h2>
              
              <div class="confirmation">
                <h3>🎉 Your registration has been confirmed!</h3>
                <p>We're excited to see you at the event. Here are your event details:</p>
              </div>
              
              <div class="event-details">
                <h3>${event.title}</h3>
                <p><strong>📅 Date:</strong> ${eventDate}</p>
                <p><strong>🕐 Time:</strong> ${eventTime}</p>
                <p><strong>💰 Price:</strong> $${event.price}</p>
                <p><strong>📍 Location:</strong> Indian Hills Country Club</p>
                <p><strong>📝 Description:</strong></p>
                <p>${event.description}</p>
              </div>
              
              <h3>What to Expect:</h3>
              <ul>
                <li>Please arrive 15 minutes early for check-in</li>
                <li>Bring a valid photo ID</li>
                <li>Dress code: Club casual (unless otherwise specified)</li>
                <li>Contact the club if you need to cancel (24-hour notice appreciated)</li>
              </ul>
              
              <p>We'll send you a reminder the day before the event. Looking forward to seeing you there!</p>
            </div>
            
            <div class="footer">
              <p>Indian Hills Country Club • Kansas City<br>
              Phone: (816) 555-0123 • <a href="mailto:events@ihcckc.com">events@ihcckc.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateEventReminderHTML(member: Member, event: Event): string {
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    
    const eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reminder: ${event.title} - Tomorrow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 14px; }
            .reminder { background: #fff3e0; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ff9800; }
            .event-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Event Reminder</h1>
              <p>Don't forget about tomorrow's event!</p>
            </div>
            
            <div class="content">
              <h2>Hello ${member.name}!</h2>
              
              <div class="reminder">
                <h3>📅 Tomorrow's Event</h3>
                <p>This is a friendly reminder about your upcoming event registration:</p>
              </div>
              
              <div class="event-details">
                <h3>${event.title}</h3>
                <p><strong>📅 Date:</strong> ${eventDate} (Tomorrow!)</p>
                <p><strong>🕐 Time:</strong> ${eventTime}</p>
                <p><strong>📍 Location:</strong> Indian Hills Country Club</p>
                <p><strong>💰 Price:</strong> $${event.price}</p>
              </div>
              
              <h3>📝 Last-Minute Reminders:</h3>
              <ul>
                <li>✅ Arrive 15 minutes early for check-in</li>
                <li>✅ Bring a valid photo ID</li>
                <li>✅ Check the weather and dress appropriately</li>
                <li>✅ Contact us if you need to cancel (today)</li>
              </ul>
              
              <p>We're looking forward to seeing you tomorrow! If you have any questions, please don't hesitate to contact the club.</p>
            </div>
            
            <div class="footer">
              <p>Indian Hills Country Club • Kansas City<br>
              Phone: (816) 555-0123 • <a href="mailto:events@ihcckc.com">events@ihcckc.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateRecommendationDigestHTML(member: Member, events: Event[]): string {
    const eventsHTML = events.map(event => {
      const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
      
      const eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      return `
        <div class="event-card">
          <div class="event-header">
            <span class="category">${event.category}</span>
            <span class="date">${eventDate}</span>
          </div>
          <h3>${event.title}</h3>
          <p class="time">🕐 ${eventTime} • 💰 $${event.price}</p>
          <p class="description">${event.description}</p>
          <a href="${event.registration_url}" class="register-btn">Register Now</a>
        </div>
      `
    }).join('')

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Recommended Events This Week</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 14px; }
            .event-card { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #667eea; }
            .event-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .category { background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .date { font-weight: bold; color: #666; }
            .time { color: #666; font-size: 14px; margin: 5px 0; }
            .description { color: #666; font-size: 14px; margin: 10px 0; }
            .register-btn { display: inline-block; background: #667eea; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Your Recommended Events</h1>
              <p>Events we think you'll love this week</p>
            </div>
            
            <div class="content">
              <h2>Hello ${member.name}!</h2>
              
              <p>Based on your preferences, we've found ${events.length} upcoming event${events.length === 1 ? '' : 's'} that might interest you:</p>
              
              ${eventsHTML}
              
              <p style="margin-top: 30px;">Want to see more events or update your preferences? Visit your MemberSync dashboard anytime.</p>
              
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">View All Events</a>
            </div>
            
            <div class="footer">
              <p>Indian Hills Country Club • Kansas City<br>
              <a href="${process.env.NEXTAUTH_URL}/dashboard">Manage Preferences</a> • <a href="mailto:support@ihcckc.com">Contact Support</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export const emailService = new EmailNotificationService()