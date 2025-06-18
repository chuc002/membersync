import { NextRequest, NextResponse } from 'next/server'
import { IHCCEventScraper } from '@/lib/ihcc-scraper'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authenticated (you might want to add API key validation)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.SYNC_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scraper = new IHCCEventScraper()
    await scraper.syncEventsToDatabase()

    return NextResponse.json({ 
      success: true, 
      message: 'Events synced successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in sync-events API:', error)
    return NextResponse.json(
      { error: 'Failed to sync events' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const scraper = new IHCCEventScraper()
    const events = await scraper.scrapeEvents()

    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in sync-events API (GET):', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' }, 
      { status: 500 }
    )
  }
}