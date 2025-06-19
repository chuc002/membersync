'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { demoUsers } from '@/lib/mock/data'
import type { MockMember } from '@/lib/mock/data'

export default function AdminMembersPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      } else {
        loadInsights()
      }
    }
  }, [user, loading, isAdmin, router])

  const loadInsights = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setPageLoading(false)
  }

  if (loading || pageLoading || !user || !isAdmin) {
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
              <h1 className="text-2xl font-bold text-gray-900">Member Preference Insights</h1>
              <p className="text-gray-600">IHCC member engagement analysis and optimization recommendations</p>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Popular Category</p>
                <p className="text-2xl font-bold text-blue-600">Golf Events</p>
                <p className="text-xs text-blue-500 mt-1">68% member interest</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏌️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growing Interest</p>
                <p className="text-2xl font-bold text-green-600">Family Events</p>
                <p className="text-xs text-green-500 mt-1">+15% this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">👨‍👩‍👧‍👦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Engagement Time</p>
                <p className="text-2xl font-bold text-purple-600">Tues 10AM</p>
                <p className="text-xs text-purple-500 mt-1">94% open rate</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Optimization Score</p>
                <p className="text-2xl font-bold text-orange-600">89%</p>
                <p className="text-xs text-orange-500 mt-1">Excellent targeting</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preference Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Preference Trends</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Golf Events</span>
                  <span className="text-sm text-gray-500">68% of members</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Dining Events</span>
                  <span className="text-sm text-gray-500">52% of members</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Family Events</span>
                  <span className="text-sm text-gray-500">45% of members (+15%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Fitness Events</span>
                  <span className="text-sm text-gray-500">38% of members</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Social Events</span>
                  <span className="text-sm text-gray-500">29% of members</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: '29%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Member Engagement Patterns</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Most Active Members</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">High engagement (5+ events/month)</span>
                    <span className="text-sm font-medium text-blue-900">12 members (43%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Regular engagement (2-4 events/month)</span>
                    <span className="text-sm font-medium text-blue-900">8 members (29%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Light engagement (1 event/month)</span>
                    <span className="text-sm font-medium text-blue-900">8 members (28%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Communication Preferences</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Email notifications enabled</span>
                    <span className="text-sm font-medium text-green-900">22 members (78%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">SMS notifications enabled</span>
                    <span className="text-sm font-medium text-green-900">16 members (57%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Family events included</span>
                    <span className="text-sm font-medium text-green-900">18 members (64%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Optimization Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">🎯 Targeting Improvements</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Increase Family Event Promotion</p>
                    <p className="text-xs text-gray-600">15% growth in family event interest this month. Consider highlighting family-friendly dining events.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Golf Event Cross-Promotion</p>
                    <p className="text-xs text-gray-600">Golf members show 34% interest in dining events. Bundle golf tournaments with post-game dining.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tuesday Morning Optimization</p>
                    <p className="text-xs text-gray-600">Best engagement window: Tuesday 10:00 AM. Schedule important announcements during this time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">📊 Performance Insights</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Filtering accuracy this month</span>
                    <span className="text-sm font-bold text-green-600">94% (+2%)</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Member satisfaction score</span>
                    <span className="text-sm font-bold text-blue-600">4.6/5.0 (+0.2)</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Event click-through rate</span>
                    <span className="text-sm font-bold text-purple-600">68% (+5%)</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Registration conversion</span>
                    <span className="text-sm font-bold text-orange-600">34% (+3%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}