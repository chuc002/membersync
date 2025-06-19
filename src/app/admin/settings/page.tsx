'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const { user, member, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('sync')
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    club: {
      name: 'Indian Hills Country Club',
      address: '5555 Tomahawk Creek Pkwy, Leawood, KS 66211',
      phone: '(913) 681-8300',
      email: 'info@ihcckc.com',
      website: 'https://www.ihcckc.com',
      timezone: 'America/Chicago',
      currency: 'USD'
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      reminderDays: 3,
      maxReminders: 2,
      welcomeEmail: true,
      registrationConfirmation: true
    },
    integrations: {
      supabaseConnected: false,
      twilioConnected: false,
      resendConnected: false,
      ihccCalendarSync: true,
      autoEventSync: true,
      syncFrequency: 'daily'
    },
    system: {
      maintenanceMode: false,
      registrationEnabled: true,
      maxFamilyMembers: 10,
      sessionTimeout: 30,
      passwordExpiration: 90,
      twoFactorRequired: false
    }
  })

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, isAdmin, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('MemberSync configuration updated successfully!')
  }

  const updateClubSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      club: { ...prev.club, [key]: value }
    }))
  }

  const updateNotificationSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }))
  }

  const updateIntegrationSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      integrations: { ...prev.integrations, [key]: value }
    }))
  }

  const updateSystemSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      system: { ...prev.system, [key]: value }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MemberSync Configuration</h1>
              <p className="text-gray-600">IHCC service settings and sync configuration</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'sync', name: 'IHCC Sync Status', icon: '🔄' },
                  { id: 'filtering', name: 'Event Filtering', icon: '🎯' },
                  { id: 'performance', name: 'Performance Metrics', icon: '📊' },
                  { id: 'notifications', name: 'Member Notifications', icon: '📧' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* IHCC Sync Status Tab */}
              {activeTab === 'sync' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">IHCC Calendar Sync Status</h3>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-medium text-green-900">Connection Status: Active</h4>
                        <p className="text-sm text-green-700">Successfully connected to IHCC calendar system</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">IHCC Calendar URL</label>
                      <input
                        type="url"
                        value="https://www.ihcckc.com/calendar/events"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Sync</label>
                      <input
                        type="text"
                        value="2 minutes ago"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sync Frequency</label>
                      <select
                        value={settings.integrations.syncFrequency}
                        onChange={(e) => updateIntegrationSetting('syncFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="5min">Every 5 minutes</option>
                        <option value="15min">Every 15 minutes</option>
                        <option value="hourly">Every hour</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Events Synced Today</label>
                      <input
                        type="text"
                        value="12 events"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.integrations.autoEventSync}
                        onChange={(e) => updateIntegrationSetting('autoEventSync', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Automatic event synchronization</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Real-time member filtering enabled</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Event Filtering Tab */}
              {activeTab === 'filtering' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Member Event Filtering Configuration</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Filtering Performance</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">94%</div>
                        <div className="text-blue-700">Accuracy Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">92%</div>
                        <div className="text-blue-700">Member Match Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">0.8s</div>
                        <div className="text-blue-700">Response Time</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Category Preferences Weight</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Golf Events Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="high">High Priority (1.5x weight)</option>
                          <option value="normal">Normal Priority (1.0x weight)</option>
                          <option value="low">Low Priority (0.5x weight)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dining Events Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="high">High Priority (1.5x weight)</option>
                          <option value="normal">Normal Priority (1.0x weight)</option>
                          <option value="low">Low Priority (0.5x weight)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Family Events Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="high">High Priority (1.5x weight)</option>
                          <option value="normal">Normal Priority (1.0x weight)</option>
                          <option value="low">Low Priority (0.5x weight)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Events Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="high">High Priority (1.5x weight)</option>
                          <option value="normal">Normal Priority (1.0x weight)</option>
                          <option value="low">Low Priority (0.5x weight)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">Consider member's past event attendance</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">Include family member preferences</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={false}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">Show events outside member preferences (discovery mode)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Service Performance Monitoring</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Uptime</span>
                          <span className="text-sm font-medium text-green-600">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Response Time</span>
                          <span className="text-sm font-medium text-blue-600">0.8s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Error Rate</span>
                          <span className="text-sm font-medium text-red-600">0.1%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Member Engagement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Weekly Active</span>
                          <span className="text-sm font-medium text-purple-600">24 members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Engagement Rate</span>
                          <span className="text-sm font-medium text-green-600">87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Satisfaction</span>
                          <span className="text-sm font-medium text-yellow-600">4.6/5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Event Matching</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Match Accuracy</span>
                          <span className="text-sm font-medium text-blue-600">94%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Click-through Rate</span>
                          <span className="text-sm font-medium text-green-600">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Registration Rate</span>
                          <span className="text-sm font-medium text-orange-600">34%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Performance Alerts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">All systems operational</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Scheduled maintenance: Sunday 3:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Member Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Member Notification Preferences</h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Notification Performance</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">85%</div>
                        <div className="text-yellow-700">Email Open Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">92%</div>
                        <div className="text-yellow-700">SMS Delivery Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">67%</div>
                        <div className="text-yellow-700">Click-through Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Email Preferences</h4>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailEnabled}
                          onChange={(e) => updateNotificationSetting('emailEnabled', e.target.checked)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">Send personalized event recommendations</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.welcomeEmail}
                          onChange={(e) => updateNotificationSetting('welcomeEmail', e.target.checked)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">Weekly engagement summary emails</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.registrationConfirmation}
                          onChange={(e) => updateNotificationSetting('registrationConfirmation', e.target.checked)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">Event registration confirmations</span>
                      </label>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">SMS Preferences</h4>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsEnabled}
                          onChange={(e) => updateNotificationSetting('smsEnabled', e.target.checked)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">SMS event reminders</span>
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Reminder Timing</label>
                        <select
                          value={settings.notifications.reminderDays}
                          onChange={(e) => updateNotificationSetting('reminderDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={1}>1 day before</option>
                          <option value={3}>3 days before</option>
                          <option value={7}>1 week before</option>
                          <option value={14}>2 weeks before</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Member Communication Insights</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Most engaged communication time</span>
                        <span className="text-sm font-medium text-gray-900">Tuesday 10:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preferred communication method</span>
                        <span className="text-sm font-medium text-gray-900">Email (78% preference)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average response time</span>
                        <span className="text-sm font-medium text-gray-900">4.2 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Updating...' : 'Update Configuration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}