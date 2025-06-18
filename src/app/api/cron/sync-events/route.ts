import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🕒 Mock: Starting automated event sync...')
    
    // Mock cron job - return success for demo
    return NextResponse.json({
      success: true,
      message: 'Mock: Events synced successfully via cron job',
      mode: 'demo',
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