'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { MockAuthService } from '@/lib/mock/services'
import type { MockMember } from '@/lib/mock/data'

type EventCategory = 'Golf' | 'Dining' | 'Kids' | 'Fitness' | 'Social'

const categoryColors: Record<EventCategory, string> = {
  Golf: 'bg-green-100 text-green-800',
  Dining: 'bg-purple-100 text-purple-800',
  Kids: 'bg-blue-100 text-blue-800',
  Fitness: 'bg-orange-100 text-orange-800',
  Social: 'bg-pink-100 text-pink-800',
}

export default function ProfilePage() {
  const { user, member, signOut, loading, isMember } = useAuth()
  const router = useRouter()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<MockMember>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!isMember) {
        router.push('/admin')
      } else if (member) {
        setFormData({
          name: member.name,
          email: member.email,
          phone: member.phone,
          preferences: member.preferences,
        })
      }
    }
  }, [user, member, loading, isMember, router])

  if (loading || !user || !isMember || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSave = async () => {
    if (!member || !formData) return
    
    setSaving(true)
    try {
      const updatedMember: MockMember = {
        ...member,
        name: formData.name || member.name,
        phone: formData.phone || member.phone,
        preferences: formData.preferences || member.preferences,
      }
      
      MockAuthService.updateMember(updatedMember)
      setEditMode(false)
      
      // Trigger auth state update
      window.dispatchEvent(new Event('authStateChanged'))
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = (category: string) => {
    if (!formData.preferences) return
    
    const currentCategories = formData.preferences.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        categories: newCategories
      }
    })
  }

  const updateNotificationPreference = (key: string, value: boolean) => {
    if (!formData.preferences) return
    
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        notifications: {
          ...formData.preferences.notifications,
          [key]: value
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/family')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Family
              </button>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{member.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <p className="text-gray-900">{member.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="text-gray-900">{member.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-900">
                  {new Date(member.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Event Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Event Categories</h3>
              <div className="flex flex-wrap gap-3">
                {Object.keys(categoryColors).map((category) => (
                  <button
                    key={category}
                    onClick={() => editMode && toggleCategory(category)}
                    disabled={!editMode}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.preferences?.categories?.includes(category)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } ${!editMode ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.email || false}
                      onChange={(e) => editMode && updateNotificationPreference('email', e.target.checked)}
                      disabled={!editMode}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.sms || false}
                      onChange={(e) => editMode && updateNotificationPreference('sms', e.target.checked)}
                      disabled={!editMode}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">SMS notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.reminders || false}
                      onChange={(e) => editMode && updateNotificationPreference('reminders', e.target.checked)}
                      disabled={!editMode}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Event reminders</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Family Events</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences?.familyEvents || false}
                    onChange={(e) => editMode && setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences!,
                        familyEvents: e.target.checked
                      }
                    })}
                    disabled={!editMode}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Include family-friendly events in recommendations</span>
                </label>
              </div>
            </div>
          </div>

          {/* Family Members Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Family Members</h2>
              <button
                onClick={() => router.push('/family')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Family
              </button>
            </div>
            {member.family_members.length > 0 ? (
              <div className="space-y-2">
                {member.family_members.map((familyMember, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <span className="font-medium text-gray-900">{familyMember.name}</span>
                      <span className="text-gray-600 ml-2">• {familyMember.relationship} • Age {familyMember.age}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {familyMember.notificationPreferences.email && '📧'} 
                      {familyMember.notificationPreferences.sms && '📱'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No family members added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}