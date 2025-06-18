import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.SYNC_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get member statistics
    const { data: totalMembers } = await supabase
      .from('members')
      .select('id', { count: 'exact' })

    const { data: newMembers } = await supabase
      .from('members')
      .select('id', { count: 'exact' })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get event statistics
    const { data: totalEvents } = await supabase
      .from('events')
      .select('id', { count: 'exact' })
      .gte('date', new Date().toISOString().split('T')[0])

    const { data: eventsByCategory } = await supabase
      .from('events')
      .select('category', { count: 'exact' })
      .gte('date', new Date().toISOString().split('T')[0])

    // Get registration statistics
    const { data: totalRegistrations } = await supabase
      .from('registrations')
      .select('id', { count: 'exact' })
      .gte('registered_at', thirtyDaysAgo.toISOString())

    const { data: recentRegistrations } = await supabase
      .from('registrations')
      .select(`
        id,
        registered_at,
        events!inner(title, category),
        members!inner(name)
      `)
      .gte('registered_at', thirtyDaysAgo.toISOString())
      .order('registered_at', { ascending: false })
      .limit(10)

    // Calculate popular events
    const { data: popularEvents } = await supabase
      .from('registrations')
      .select(`
        event_id,
        events!inner(title, category)
      `)
      .gte('registered_at', thirtyDaysAgo.toISOString())

    // Group by event and count registrations
    const eventCounts = popularEvents?.reduce((acc: any, reg: any) => {
      const eventId = reg.event_id
      const eventTitle = reg.events.title
      const eventCategory = reg.events.category
      
      if (!acc[eventId]) {
        acc[eventId] = {
          title: eventTitle,
          category: eventCategory,
          registrations: 0
        }
      }
      acc[eventId].registrations++
      return acc
    }, {})

    const topEvents = Object.values(eventCounts || {})
      .sort((a: any, b: any) => b.registrations - a.registrations)
      .slice(0, 5)

    // Get family statistics
    const { data: membersWithFamilies } = await supabase
      .from('members')
      .select('family_members')
      .neq('family_members', '[]')

    const familyStats = {
      totalMembersWithFamilies: membersWithFamilies?.length || 0,
      totalFamilyMembers: membersWithFamilies?.reduce((total, member) => {
        const familyMembers = Array.isArray(member.family_members) ? member.family_members : []
        return total + familyMembers.length
      }, 0) || 0
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analytics: {
        members: {
          total: totalMembers?.length || 0,
          newThisMonth: newMembers?.length || 0,
          withFamilies: familyStats.totalMembersWithFamilies,
          totalFamilyMembers: familyStats.totalFamilyMembers
        },
        events: {
          totalUpcoming: totalEvents?.length || 0,
          byCategory: eventsByCategory || [],
          popular: topEvents
        },
        registrations: {
          totalThisMonth: totalRegistrations?.length || 0,
          recent: recentRegistrations || [],
          averagePerEvent: totalEvents?.length ? 
            Math.round((totalRegistrations?.length || 0) / totalEvents.length) : 0
        }
      }
    })
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}