import { NextRequest, NextResponse } from 'next/server'
import { IHCCEventScraper } from '@/lib/ihcc-scraper'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or has valid API key
    const authHeader = request.headers.get('authorization')
    const cronSecret = request.headers.get('x-vercel-cron-signature')
    
    if (!cronSecret && (!authHeader || authHeader !== `Bearer ${process.env.SYNC_API_KEY}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting automated event sync...')
    
    const scraper = new IHCCEventScraper()
    await scraper.syncEventsToDatabase()

    return NextResponse.json({
      success: true,
      message: 'Events synced successfully via cron job',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in cron event sync:', error)
    return NextResponse.json(
      { 
        error: 'Failed to sync events',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }, 
      { status: 500 }
    )
  }
}