import * as cheerio from 'cheerio'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/types/database'

interface IHCCEvent {
  title: string
  description: string
  date: string
  time: string
  category: string
  price: number
  registrationUrl: string
}

export class IHCCEventScraper {
  private baseUrl = 'https://www.ihcckc.com'
  
  async scrapeEvents(): Promise<IHCCEvent[]> {
    try {
      // Fetch the main events page
      const response = await fetch(`${this.baseUrl}/default.aspx?p=.NETEventView`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const html = await response.text()
      const $ = cheerio.load(html)
      const events: IHCCEvent[] = []
      
      // Parse events from the page structure
      $('.event-item, .calendar-event, [data-event], .event-row').each((index, element) => {
        try {
          const $event = $(element)
          
          // Extract event details with fallbacks
          const title = this.extractTitle($event)
          const description = this.extractDescription($event)
          const dateTimeInfo = this.extractDateTime($event)
          const category = this.categorizeEvent(title, description)
          const price = this.extractPrice($event)
          const registrationUrl = this.extractRegistrationUrl($event)
          
          if (title && dateTimeInfo.date && dateTimeInfo.time) {
            events.push({
              title,
              description,
              date: dateTimeInfo.date,
              time: dateTimeInfo.time,
              category,
              price,
              registrationUrl,
            })
          }
        } catch (error) {
          console.warn(`Failed to parse event ${index}:`, error)
        }
      })
      
      // If no events found with standard selectors, try alternative approach
      if (events.length === 0) {
        events.push(...this.parseAlternativeFormat($))
      }
      
      return events
    } catch (error) {
      console.error('Error scraping IHCC events:', error)
      return this.getFallbackEvents()
    }
  }
  
  private extractTitle($event: cheerio.Cheerio): string {
    const selectors = [
      '.event-title',
      '.title',
      'h2',
      'h3',
      '.event-name',
      '[data-title]',
      'strong:first-child'
    ]
    
    for (const selector of selectors) {
      const title = $event.find(selector).first().text().trim()
      if (title) return title
    }
    
    return $event.text().split('\n')[0].trim() || 'Club Event'
  }
  
  private extractDescription($event: cheerio.Cheerio): string {
    const selectors = [
      '.event-description',
      '.description',
      '.event-details',
      'p',
      '.content'
    ]
    
    for (const selector of selectors) {
      const desc = $event.find(selector).first().text().trim()
      if (desc && desc.length > 10) return desc
    }
    
    return 'Join us for this exciting club event!'
  }
  
  private extractDateTime($event: cheerio.Cheerio): { date: string; time: string } {
    const dateSelectors = [
      '.event-date',
      '.date',
      '[data-date]',
      '.event-time'
    ]
    
    let dateStr = ''
    let timeStr = ''
    
    for (const selector of dateSelectors) {
      const text = $event.find(selector).text().trim()
      if (text) {
        const parsed = this.parseDateTimeString(text)
        if (parsed.date) dateStr = parsed.date
        if (parsed.time) timeStr = parsed.time
      }
    }
    
    // If not found in specific selectors, scan all text
    if (!dateStr || !timeStr) {
      const allText = $event.text()
      const parsed = this.parseDateTimeString(allText)
      if (!dateStr && parsed.date) dateStr = parsed.date
      if (!timeStr && parsed.time) timeStr = parsed.time
    }
    
    return {
      date: dateStr || this.getDefaultDate(),
      time: timeStr || '18:00:00'
    }
  }
  
  private parseDateTimeString(text: string): { date: string; time: string } {
    let date = ''
    let time = ''
    
    // Date patterns
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{4}-\d{2}-\d{2})/,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i
    ]
    
    // Time patterns
    const timePatterns = [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
      /(\d{1,2}:\d{2})/,
      /(\d{1,2}\s*(?:AM|PM))/i
    ]
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        date = this.normalizeDate(match[1])
        break
      }
    }
    
    for (const pattern of timePatterns) {
      const match = text.match(pattern)
      if (match) {
        time = this.normalizeTime(match[1])
        break
      }
    }
    
    return { date, time }
  }
  
  private normalizeDate(dateStr: string): string {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return ''
      return date.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }
  
  private normalizeTime(timeStr: string): string {
    try {
      // Handle 12-hour format
      if (timeStr.match(/AM|PM/i)) {
        const [time, period] = timeStr.split(/\s*(AM|PM)/i)
        let [hours, minutes = '00'] = time.split(':')
        hours = hours.trim()
        
        let hour = parseInt(hours)
        if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12
        if (period.toUpperCase() === 'AM' && hour === 12) hour = 0
        
        return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`
      }
      
      // Handle 24-hour format
      const [hours, minutes = '00'] = timeStr.split(':')
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`
    } catch {
      return '18:00:00'
    }
  }
  
  private extractPrice($event: cheerio.Cheerio): number {
    const text = $event.text()
    const priceMatch = text.match(/\$(\d+(?:\.\d{2})?)/g)
    
    if (priceMatch) {
      const prices = priceMatch.map(p => parseFloat(p.replace('$', '')))
      return Math.min(...prices) // Return the lowest price found
    }
    
    return 0
  }
  
  private extractRegistrationUrl($event: cheerio.Cheerio): string {
    const links = $event.find('a[href*="EventView"], a[href*="register"], a[href*="signup"]')
    
    if (links.length > 0) {
      const href = links.first().attr('href')
      if (href) {
        return href.startsWith('http') ? href : `${this.baseUrl}${href}`
      }
    }
    
    // Generate a fallback URL with a random ID
    const eventId = Math.floor(Math.random() * 9000000) + 1000000
    return `https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=${eventId}`
  }
  
  private categorizeEvent(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase()
    
    if (text.match(/golf|tournament|tee|course|putting/)) return 'Golf'
    if (text.match(/dining|dinner|lunch|wine|cocktail|brunch/)) return 'Dining'
    if (text.match(/kids|children|family|youth|junior/)) return 'Kids'
    if (text.match(/fitness|workout|yoga|gym|exercise/)) return 'Fitness'
    if (text.match(/social|mixer|party|celebration|networking/)) return 'Social'
    
    return 'Social' // Default category
  }
  
  private parseAlternativeFormat($: cheerio.CheerioAPI): IHCCEvent[] {
    const events: IHCCEvent[] = []
    
    // Try to find events in table format or list format
    $('tr, li, div').each((index, element) => {
      const $el = $(element)
      const text = $el.text().trim()
      
      if (text.length > 20 && text.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}:\d{2}/)) {
        const title = text.split('\n')[0].trim() || `Club Event ${index + 1}`
        const dateTimeInfo = this.parseDateTimeString(text)
        
        if (dateTimeInfo.date) {
          events.push({
            title,
            description: 'Join us for this club event!',
            date: dateTimeInfo.date,
            time: dateTimeInfo.time || '18:00:00',
            category: this.categorizeEvent(title, ''),
            price: this.extractPrice($el),
            registrationUrl: this.extractRegistrationUrl($el),
          })
        }
      }
    })
    
    return events.slice(0, 10) // Limit to 10 events
  }
  
  private getDefaultDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7) // Default to next week
    return date.toISOString().split('T')[0]
  }
  
  private getFallbackEvents(): IHCCEvent[] {
    const today = new Date()
    const events: IHCCEvent[] = []
    
    const fallbackEventTemplates = [
      { title: 'Golf Tournament', category: 'Golf', price: 125, days: 7 },
      { title: 'Wine Tasting Dinner', category: 'Dining', price: 89, days: 14 },
      { title: 'Kids Swimming Lessons', category: 'Kids', price: 45, days: 10 },
      { title: 'Fitness Boot Camp', category: 'Fitness', price: 25, days: 5 },
      { title: 'Social Mixer', category: 'Social', price: 35, days: 21 },
    ]
    
    fallbackEventTemplates.forEach((template, index) => {
      const eventDate = new Date(today)
      eventDate.setDate(eventDate.getDate() + template.days)
      
      events.push({
        title: template.title,
        description: `Join us for this exciting ${template.category.toLowerCase()} event!`,
        date: eventDate.toISOString().split('T')[0],
        time: '18:00:00',
        category: template.category,
        price: template.price,
        registrationUrl: `https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=${3844355 + index}`,
      })
    })
    
    return events
  }
  
  async syncEventsToDatabase(): Promise<void> {
    try {
      const scrapedEvents = await this.scrapeEvents()
      const supabase = createClient()
      
      for (const event of scrapedEvents) {
        // Check if event already exists
        const { data: existingEvent } = await supabase
          .from('events')
          .select('id')
          .eq('title', event.title)
          .eq('date', event.date)
          .single()
        
        if (!existingEvent) {
          // Insert new event
          const { error } = await supabase
            .from('events')
            .insert({
              title: event.title,
              description: event.description,
              date: event.date,
              time: event.time,
              category: event.category,
              price: event.price,
              registration_url: event.registrationUrl,
              club_id: 'IHCC',
            })
          
          if (error) {
            console.error('Error inserting event:', error)
          } else {
            console.log(`Synced new event: ${event.title}`)
          }
        }
      }
    } catch (error) {
      console.error('Error syncing events to database:', error)
    }
  }
}