import type { MockEvent } from './mock/data'

interface CSVEventRow {
  Subject: string
  'Start Date': string
  'Start Time': string
  'End Date': string
  'End Time': string
  Description: string
  Location: string
}

type EventCategory = 'Golf' | 'Dining' | 'Kids' | 'Fitness' | 'Social'

export class IHCCEventImporter {
  private static categorizeEvent(subject: string, description: string): EventCategory {
    const text = `${subject} ${description}`.toLowerCase()
    
    // Golf keywords
    if (text.includes('golf') || text.includes('tee') || text.includes('course') || 
        text.includes('tournament') || text.includes('scramble') || text.includes('pro shop')) {
      return 'Golf'
    }
    
    // Kids keywords
    if (text.includes('jr.') || text.includes('junior') || text.includes('kids') || 
        text.includes('children') || text.includes('son') || text.includes('daughter') ||
        text.includes('youth') || text.includes('father-son') || text.includes('mother-daughter') ||
        text.includes('family') && (text.includes('fun') || text.includes('night') || text.includes('activity'))) {
      return 'Kids'
    }
    
    // Fitness keywords
    if (text.includes('fitness') || text.includes('workout') || text.includes('training') ||
        text.includes('cardio') || text.includes('sculpt') || text.includes('barre') ||
        text.includes('aqua') || text.includes('pool') || text.includes('circuit') ||
        text.includes('conditioning') || text.includes('weights') || text.includes('wow') ||
        text.includes('strength') || text.includes('exercise') || text.includes('yoga') ||
        text.includes('pilates') || text.includes('zumba') || text.includes('spin') ||
        text.includes('clinic') && (text.includes('fitness') || text.includes('training')) ||
        text.includes('massage') || text.includes('wellness') || text.includes('h2o') ||
        text.includes('tennis') && (text.includes('clinic') || text.includes('lesson'))) {
      return 'Fitness'
    }
    
    // Dining keywords
    if (text.includes('dining') || text.includes('dinner') || text.includes('lunch') ||
        text.includes('breakfast') || text.includes('brunch') || text.includes('wine') ||
        text.includes('tasting') || text.includes('chef') || text.includes('menu') ||
        text.includes('food') || text.includes('cuisine') || text.includes('restaurant') ||
        text.includes('buffet') || text.includes('cocktail') || text.includes('happy hour') ||
        text.includes('meal') || text.includes('culinary')) {
      return 'Dining'
    }
    
    // Social keywords (default for many events)
    if (text.includes('social') || text.includes('party') || text.includes('event') ||
        text.includes('member') || text.includes('guest') || text.includes('celebration') ||
        text.includes('night') || text.includes('fun') || text.includes('entertainment') ||
        text.includes('music') || text.includes('dance') || text.includes('mixer') ||
        text.includes('meeting') || text.includes('trivia') || text.includes('game') ||
        text.includes('tournament') && !text.includes('golf') || text.includes('tennis') && !text.includes('clinic')) {
      return 'Social'
    }
    
    // Default to Social for uncategorized events
    return 'Social'
  }

  private static calculatePrice(category: EventCategory, subject: string, description: string): number {
    const text = `${subject} ${description}`.toLowerCase()
    
    // Extract price from description if mentioned
    const priceMatch = text.match(/\$(\d+)/);
    if (priceMatch) {
      return parseInt(priceMatch[1])
    }
    
    // Default pricing by category
    switch (category) {
      case 'Golf':
        return Math.floor(Math.random() * 50) + 50; // $50-100
      case 'Dining':
        return Math.floor(Math.random() * 40) + 30; // $30-70
      case 'Kids':
        return Math.floor(Math.random() * 20) + 15; // $15-35
      case 'Fitness':
        return Math.floor(Math.random() * 15) + 10; // $10-25
      case 'Social':
        return Math.floor(Math.random() * 30) + 20; // $20-50
      default:
        return 25
    }
  }

  private static cleanDescription(description: string): string {
    // Remove URL encoding artifacts
    let cleaned = description
      .replace(/=0D=0A/g, '\n')
      .replace(/=3D/g, '=')
      .replace(/\n+/g, ' ')
      .trim()
    
    // Remove URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '')
    
    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim()
    
    // Truncate if too long
    if (cleaned.length > 200) {
      cleaned = cleaned.substring(0, 197) + '...'
    }
    
    return cleaned || 'Join us for this exciting IHCC event!'
  }

  private static parseDateTime(dateStr: string, timeStr: string): string {
    try {
      // Parse date in M/D/YYYY format
      const [month, day, year] = dateStr.split('/')
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      
      // Convert 12-hour time to 24-hour
      const [time, period] = timeStr.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours)
      
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      const formattedTime = `${hour24.toString().padStart(2, '0')}:${minutes || '00'}`
      
      return `${formattedDate}T${formattedTime}:00Z`
    } catch (error) {
      console.error('Error parsing date/time:', dateStr, timeStr, error)
      return new Date().toISOString()
    }
  }

  static parseCSVText(csvText: string): MockEvent[] {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split('\t').map(h => h.trim())
    const events: MockEvent[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t')
      
      if (values.length < headers.length) continue

      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || ''
      })

      const subject = row['Subject'] || ''
      const startDate = row['Start Date'] || ''
      const startTime = row['Start Time'] || ''
      const description = row['Description'] || ''
      const location = row['Location'] || 'Indian Hills Country Club'

      if (!subject || !startDate) continue

      const category = this.categorizeEvent(subject, description)
      const cleanDesc = this.cleanDescription(description)
      const price = this.calculatePrice(category, subject, description)

      const event: MockEvent = {
        id: `ihcc-${i}`,
        title: subject,
        description: cleanDesc,
        date: startDate.replace(/\//g, '-'), // Convert M/D/YYYY to M-D-YYYY
        time: startTime.replace(/\s/g, ''), // Remove spaces from time
        category,
        price,
        location,
        url: `https://www.ihcckc.com/events/${encodeURIComponent(subject.toLowerCase().replace(/\s+/g, '-'))}`
      }

      events.push(event)
    }

    return events
  }

  static async processCSVFile(file: File): Promise<MockEvent[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string
          const events = this.parseCSVText(csvText)
          resolve(events)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  static generateSampleEvents(): MockEvent[] {
    const sampleCSV = `Subject	Start Date	Start Time	End Date	End Time	All day event	Reminder on/off	Reminder Date	Reminder Time	Meeting Organizer	Required Attendees	Optional Attendees	Meeting Resources	Billing Information	Categories	Description	Location	Mileage	Priority	Private	Sensitivity	Show time as
WoW Day #2 5:15 AM	6/20/2025	5:15 AM	6/20/2025	6:15 AM	FALSE	FALSE	6/20/2025	5:00 AM						Indian Hills CC	Women on Weights is a strength training program targeting women of all levels, get stronger together! Spaces are limited and you must be registered. *YOU MUST BE PRE-REGISTERED TO JOIN THIS PROGRAM This 8-week program includes: pre-and post-assessment • 60-minute Strength Training 2x's / week Led by IHCC personal trainer • Group Class of choice 2x's / week • Individualized macronutrient plan • Tracking card for accountability Including exercise progression, sleep, water intake and nutrition • Weekly cardio option workouts		Normal	FALSE	Normal	2
Cardio Sculpt 7:00 AM	6/20/2025	7:00 AM	6/20/2025	7:00 AM	FALSE	FALSE	6/20/2025	6:45 AM						Indian Hills CC	A great way to sweat and sculpt while building aerobic capacity. The exercises will keep you moving, sweating, and having fun!		Normal	FALSE	Normal	2
Jr. Tennis Member-Guest	6/20/2025	6:00 PM	6/20/2025	8:00 PM	FALSE	FALSE	6/20/2025	5:45 PM						Indian Hills CC	Invite a friend for tennis, pizza, drinks, and prizes! $25++ per person		Normal	FALSE	Normal	2
Father-Son Night of Fun!	6/22/2025	5:00 PM	6/22/2025	8:00 PM	FALSE	FALSE	6/22/2025	4:45 PM						Indian Hills CC	Dads and sons, join us for laser tag, zorb ball bowling, sumo suit wrestling, food, and fun! Dads - $45 and Sons - $30		Normal	FALSE	Normal	2
Circuit Training 8:30 AM	6/21/2025	8:30 AM	6/21/2025	9:30 AM	FALSE	FALSE	6/21/2025	8:15 AM						Indian Hills CC	A metabolism boosting workout utilizing multiple joint movements and full body exercises performed at a high intensity, formatted in a circuit style class. The exercises are constantly changing, forcing you to use your whole body as a unit.		Normal	FALSE	Normal	2`

    return this.parseCSVText(sampleCSV)
  }
}

export default IHCCEventImporter