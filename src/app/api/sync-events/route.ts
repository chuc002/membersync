import { NextRequest, NextResponse } from 'next/server'
import { mockEvents } from '@/lib/mock/data'

export async function POST(request: NextRequest) {
  try {
    // Mock sync - return success for demo
    console.log('📅 Mock: Events sync completed')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Mock: Events synced successfully',
      eventsProcessed: mockEvents.length,
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
    // Return mock events for demo
    return NextResponse.json({ 
      success: true, 
      events: mockEvents,
      count: mockEvents.length,
      mode: 'demo',
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