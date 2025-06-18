import { NextRequest, NextResponse } from 'next/server'
import { mockEvents } from '@/lib/mock/data'

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data for demo
    const categoryStats = mockEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mockAnalytics = {
      members: {
        total: 247,
        newThisMonth: 23,
        withFamilies: 89,
        totalFamilyMembers: 156
      },
      events: {
        totalUpcoming: mockEvents.length,
        byCategory: Object.entries(categoryStats).map(([category, count]) => ({ category, count })),
        popular: [
          { title: 'Championship Golf Tournament', category: 'Golf', registrations: 45 },
          { title: 'Kids Summer Camp', category: 'Kids', registrations: 38 },
          { title: 'Wine Tasting Evening', category: 'Dining', registrations: 32 },
          { title: 'Family Pool Party', category: 'Social', registrations: 28 },
          { title: 'Morning Yoga Class', category: 'Fitness', registrations: 24 }
        ]
      },
      registrations: {
        totalThisMonth: 156,
        recent: [
          { id: '1', registered_at: new Date().toISOString(), events: { title: 'Wine Tasting Evening', category: 'Dining' }, members: { name: 'John Smith' } },
          { id: '2', registered_at: new Date().toISOString(), events: { title: 'Golf Tournament', category: 'Golf' }, members: { name: 'Sarah Johnson' } }
        ],
        averagePerEvent: Math.round(156 / mockEvents.length)
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      mode: 'demo',
      analytics: mockAnalytics
    })
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}