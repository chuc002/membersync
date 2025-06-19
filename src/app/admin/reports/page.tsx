'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { mockEvents, demoUsers } from '@/lib/mock/data'
import type { MockEvent, MockMember } from '@/lib/mock/data'

interface AnalyticsData {
  memberEngagement: {
    totalMembers: number
    activeMembers: number
    newMembersThisMonth: number
    engagementRate: number
    membersByCategory: { category: string; count: number }[]
    memberGrowth: { month: string; members: number }[]
  }
  eventPerformance: {
    totalEvents: number
    totalRegistrations: number
    averageAttendance: number
    revenue: number
    eventsByCategory: { category: string; count: number; revenue: number }[]
    popularEvents: { title: string; registrations: number; revenue: number }[]
  }
  revenueMetrics: {
    totalRevenue: number
    monthlyRevenue: { month: string; revenue: number }[]
    revenueByCategory: { category: string; revenue: number }[]
    averageEventPrice: number
  }
}

export default function AdminReportsPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      } else {
        loadAnalytics()
      }
    }
  }, [user, loading, isAdmin, router])

  const loadAnalytics = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate mock analytics data based on existing data
    const totalMembers = demoUsers.length + 15 // Add some mock additional members
    const activeMembers = Math.floor(totalMembers * 0.75)
    const newMembersThisMonth = 8
    const engagementRate = Math.round((activeMembers / totalMembers) * 100)

    // Mock member registration data
    const mockRegistrations = [
      { id: '1', event_id: '1', registered_at: '2024-06-15T10:30:00Z', price: 75 },
      { id: '2', event_id: '1', registered_at: '2024-06-15T11:15:00Z', price: 75 },
      { id: '3', event_id: '1', registered_at: '2024-06-15T14:20:00Z', price: 75 },
      { id: '4', event_id: '2', registered_at: '2024-06-16T09:45:00Z', price: 45 },
      { id: '5', event_id: '2', registered_at: '2024-06-16T13:30:00Z', price: 45 },
      { id: '6', event_id: '3', registered_at: '2024-06-17T08:15:00Z', price: 25 },
      { id: '7', event_id: '4', registered_at: '2024-06-17T16:45:00Z', price: 125 },
      { id: '8', event_id: '5', registered_at: '2024-06-18T07:30:00Z', price: 65 },
    ]

    const totalRegistrations = mockRegistrations.length + 25 // Add mock additional registrations
    const totalRevenue = mockRegistrations.reduce((sum, reg) => sum + reg.price, 0) + 2150 // Add mock additional revenue

    const analyticsData: AnalyticsData = {
      memberEngagement: {
        totalMembers,
        activeMembers,
        newMembersThisMonth,
        engagementRate,
        membersByCategory: [
          { category: 'Golf', count: 12 },
          { category: 'Dining', count: 8 },
          { category: 'Fitness', count: 6 },
          { category: 'Kids', count: 4 },
          { category: 'Social', count: 5 }
        ],
        memberGrowth: [
          { month: 'Jan', members: 15 },
          { month: 'Feb', members: 18 },
          { month: 'Mar', members: 22 },
          { month: 'Apr', members: 26 },
          { month: 'May', members: 28 },
          { month: 'Jun', members: totalMembers }
        ]
      },
      eventPerformance: {
        totalEvents: mockEvents.length,
        totalRegistrations,
        averageAttendance: Math.round(totalRegistrations / mockEvents.length),
        revenue: totalRevenue,
        eventsByCategory: [
          { category: 'Golf', count: 2, revenue: 1200 },
          { category: 'Dining', count: 1, revenue: 850 },
          { category: 'Kids', count: 1, revenue: 325 },
          { category: 'Fitness', count: 1, revenue: 475 },
          { category: 'Social', count: 1, revenue: 650 }
        ],
        popularEvents: [
          { title: 'Summer Golf Tournament', registrations: 12, revenue: 900 },
          { title: 'Wine Tasting Evening', registrations: 8, revenue: 720 },
          { title: 'Kids Summer Camp', registrations: 15, revenue: 375 },
          { title: 'Fitness Boot Camp', registrations: 6, revenue: 390 },
          { title: 'Member Appreciation Dinner', registrations: 10, revenue: 650 }
        ]
      },
      revenueMetrics: {
        totalRevenue,
        monthlyRevenue: [
          { month: 'Jan', revenue: 2800 },
          { month: 'Feb', revenue: 3200 },
          { month: 'Mar', revenue: 2950 },
          { month: 'Apr', revenue: 3600 },
          { month: 'May', revenue: 3100 },
          { month: 'Jun', revenue: totalRevenue }
        ],
        revenueByCategory: [
          { category: 'Golf', revenue: 1200 },
          { category: 'Dining', revenue: 850 },
          { category: 'Social', revenue: 650 },
          { category: 'Fitness', revenue: 475 },
          { category: 'Kids', revenue: 325 }
        ],
        averageEventPrice: Math.round(totalRevenue / totalRegistrations)
      }
    }

    setAnalytics(analyticsData)
    setPageLoading(false)
  }

  if (loading || pageLoading || !user || !isAdmin || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600">Club performance metrics and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(analytics.revenueMetrics.totalRevenue)}</p>
                <p className="text-sm text-green-500">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.memberEngagement.activeMembers}</p>
                <p className="text-sm text-blue-500">{analytics.memberEngagement.engagementRate}% engagement rate</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Event Registrations</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.eventPerformance.totalRegistrations}</p>
                <p className="text-sm text-purple-500">Avg {analytics.eventPerformance.averageAttendance} per event</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Members</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.memberEngagement.newMembersThisMonth}</p>
                <p className="text-sm text-orange-500">This month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Member Growth Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Growth</h3>
            <div className="space-y-4">
              {analytics.memberEngagement.memberGrowth.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(data.members / analytics.memberEngagement.totalMembers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{data.members}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
            <div className="space-y-4">
              {analytics.revenueMetrics.revenueByCategory.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(category.revenue / analytics.revenueMetrics.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16">{formatCurrency(category.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Engagement Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Categories</h3>
            <div className="space-y-3">
              {analytics.memberEngagement.membersByCategory.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(category.count / analytics.memberEngagement.totalMembers) * 100 * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-6">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Performance</h3>
            <div className="space-y-3">
              {analytics.eventPerformance.eventsByCategory.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{category.category}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{category.count} events</div>
                    <div className="text-xs text-green-600">{formatCurrency(category.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <div className="space-y-3">
              {analytics.revenueMetrics.monthlyRevenue.slice(-6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(month.revenue / Math.max(...analytics.revenueMetrics.monthlyRevenue.map(m => m.revenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16">{formatCurrency(month.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Events Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Registrations</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Avg. Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.eventPerformance.popularEvents.map((event, index) => {
                  const avgPrice = event.revenue / event.registrations
                  const performance = event.registrations > 10 ? 'High' : event.registrations > 5 ? 'Medium' : 'Low'
                  return (
                    <tr key={event.title} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{event.title}</td>
                      <td className="py-3 px-4 text-gray-600">{event.registrations}</td>
                      <td className="py-3 px-4 text-gray-600">{formatCurrency(event.revenue)}</td>
                      <td className="py-3 px-4 text-gray-600">{formatCurrency(avgPrice)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          performance === 'High' ? 'bg-green-100 text-green-800' :
                          performance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {performance}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export Member Report (CSV)
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Export Revenue Report (PDF)
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Export Event Analytics (Excel)
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Generate Custom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}