'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import CSVImporter from '@/components/CSVImporter'
import type { MockEvent } from '@/lib/mock/data'

export default function AdminDashboard() {
  const { user, member, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [showCSVImporter, setShowCSVImporter] = useState(false)
  const [analytics, setAnalytics] = useState({
    syncStatus: 'Connected',
    lastSync: '2 minutes ago',
    memberEngagement: 87,
    filteringAccuracy: 94,
    weeklyActiveMembers: 24,
    eventMatchRate: 92,
    memberSatisfaction: 4.6,
    optimizationScore: 89
  })

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
    await new Promise(resolve => setTimeout(resolve, 500))
    setAnalytics({
      syncStatus: 'Connected',
      lastSync: '2 minutes ago',
      memberEngagement: 87,
      filteringAccuracy: 94,
      weeklyActiveMembers: 24,
      eventMatchRate: 92,
      memberSatisfaction: 4.6,
      optimizationScore: 89
    })
  }

  const handleEventsImported = (events: MockEvent[]) => {
    console.log(`Imported ${events.length} events:`, events)
    // Here you would typically save to your backend/database
    // For now, we'll just log the imported events
    alert(`Successfully imported ${events.length} IHCC events! Check the console for details.`)
    setShowCSVImporter(false)
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MemberSync Analytics</h1>
              <p className="text-gray-600">Professional member engagement service for Indian Hills Country Club</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">IHCC Premium Service</div>
                <div className="text-xs text-gray-500">Last sync: {analytics.lastSync}</div>
              </div>
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
        {/* Service Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Service Status</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">IHCC Calendar Sync: {analytics.syncStatus}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Member Filtering: Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Analytics: Real-time</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Overall Service Health</div>
                <div className="text-2xl font-bold text-green-600">{analytics.optimizationScore}%</div>
              </div>
              <button
                onClick={() => setShowCSVImporter(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Import IHCC Events
              </button>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Member Engagement</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.memberEngagement}%</p>
                <p className="text-xs text-blue-500 mt-1">+5% from last week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtering Accuracy</p>
                <p className="text-3xl font-bold text-green-600">{analytics.filteringAccuracy}%</p>
                <p className="text-xs text-green-500 mt-1">Excellent performance</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Active Members</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.weeklyActiveMembers}</p>
                <p className="text-xs text-purple-500 mt-1">85% of total members</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Event Match Rate</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.eventMatchRate}%</p>
                <p className="text-xs text-orange-500 mt-1">Members find relevant events</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Service Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Engagement Analytics</h3>
            <p className="text-gray-600 mb-4">Weekly engagement reports, member activity trends, and preference analysis</p>
            <button
              onClick={() => router.push('/admin/reports')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Analytics
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Service Configuration</h3>
            <p className="text-gray-600 mb-4">IHCC calendar sync settings, filtering parameters, and system status</p>
            <button
              onClick={() => router.push('/admin/settings')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Settings
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Optimization Insights</h3>
            <p className="text-gray-600 mb-4">Monthly optimization suggestions and member preference trend analysis</p>
            <button
              onClick={() => router.push('/admin/members')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Insights
            </button>
          </div>
        </div>

        {/* Service Performance Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Member Engagement Highlights</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Golf category engagement</span>
                  <span className="text-sm font-medium text-green-600">+12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Family event interest</span>
                  <span className="text-sm font-medium text-blue-600">+8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dining event participation</span>
                  <span className="text-sm font-medium text-purple-600">+15%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">System Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average response time</span>
                  <span className="text-sm font-medium text-gray-900">0.8s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member satisfaction</span>
                  <span className="text-sm font-medium text-yellow-600">{analytics.memberSatisfaction}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Importer Modal */}
      {showCSVImporter && (
        <CSVImporter
          onEventsImported={handleEventsImported}
          onClose={() => setShowCSVImporter(false)}
        />
      )}
    </div>
  )
}