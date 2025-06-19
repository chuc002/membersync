'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

interface ClubBranding {
  logo: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  welcomeMessage: string
}

interface ClubSettings {
  membershipTypes: string[]
  amenities: string[]
  operatingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  policies: {
    guestPolicy: string
    dressCode: string
    cancellationPolicy: string
    refundPolicy: string
  }
}

export default function AdminClubsPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('branding')
  const [saving, setSaving] = useState(false)
  
  const [branding, setBranding] = useState<ClubBranding>({
    logo: '/logo-placeholder.png',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter',
    welcomeMessage: 'Welcome to Indian Hills Country Club - Where tradition meets excellence'
  })

  const [settings, setSettings] = useState<ClubSettings>({
    membershipTypes: ['Individual', 'Family', 'Corporate', 'Junior', 'Senior'],
    amenities: ['18-hole Championship Golf Course', 'Tennis Courts', 'Swimming Pool', 'Fitness Center', 'Fine Dining Restaurant', 'Pro Shop', 'Event Facilities', 'Kids Club'],
    operatingHours: {
      'Monday': { open: '06:00', close: '22:00', closed: false },
      'Tuesday': { open: '06:00', close: '22:00', closed: false },
      'Wednesday': { open: '06:00', close: '22:00', closed: false },
      'Thursday': { open: '06:00', close: '22:00', closed: false },
      'Friday': { open: '06:00', close: '23:00', closed: false },
      'Saturday': { open: '06:00', close: '23:00', closed: false },
      'Sunday': { open: '07:00', close: '21:00', closed: false },
    },
    policies: {
      guestPolicy: 'Members may bring up to 4 guests per visit. Guest fees apply for golf and dining.',
      dressCode: 'Business casual attire required in dining areas. Golf attire with collared shirts required on course.',
      cancellationPolicy: 'Events may be cancelled up to 48 hours in advance for full refund.',
      refundPolicy: 'Refunds processed within 5-7 business days to original payment method.'
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Club settings saved successfully!')
  }

  const updateBranding = (key: keyof ClubBranding, value: string) => {
    setBranding(prev => ({ ...prev, [key]: value }))
  }

  const updateOperatingHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: { ...prev.operatingHours[day], [field]: value }
      }
    }))
  }

  const updatePolicy = (key: keyof ClubSettings['policies'], value: string) => {
    setSettings(prev => ({
      ...prev,
      policies: { ...prev.policies, [key]: value }
    }))
  }

  const addMembershipType = () => {
    const newType = prompt('Enter new membership type:')
    if (newType && !settings.membershipTypes.includes(newType)) {
      setSettings(prev => ({
        ...prev,
        membershipTypes: [...prev.membershipTypes, newType]
      }))
    }
  }

  const removeMembershipType = (type: string) => {
    setSettings(prev => ({
      ...prev,
      membershipTypes: prev.membershipTypes.filter(t => t !== type)
    }))
  }

  const addAmenity = () => {
    const newAmenity = prompt('Enter new amenity:')
    if (newAmenity && !settings.amenities.includes(newAmenity)) {
      setSettings(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }))
    }
  }

  const removeAmenity = (amenity: string) => {
    setSettings(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Club Configuration</h1>
              <p className="text-gray-600">Manage club branding, settings, and policies</p>
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
                  { id: 'branding', name: 'Branding', icon: '🎨' },
                  { id: 'membership', name: 'Membership', icon: '👥' },
                  { id: 'amenities', name: 'Amenities', icon: '🏌️' },
                  { id: 'hours', name: 'Operating Hours', icon: '🕐' },
                  { id: 'policies', name: 'Policies', icon: '📋' }
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
              {/* Branding Tab */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Club Branding</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                        <textarea
                          value={branding.welcomeMessage}
                          onChange={(e) => updateBranding('welcomeMessage', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={branding.primaryColor}
                              onChange={(e) => updateBranding('primaryColor', e.target.value)}
                              className="w-12 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={branding.primaryColor}
                              onChange={(e) => updateBranding('primaryColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={branding.secondaryColor}
                              onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                              className="w-12 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={branding.secondaryColor}
                              onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select
                          value={branding.fontFamily}
                          onChange={(e) => updateBranding('fontFamily', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Lato">Lato</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Club Logo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-gray-600">Click to upload logo</p>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                        <div 
                          className="p-4 rounded-lg text-white"
                          style={{ backgroundColor: branding.primaryColor, fontFamily: branding.fontFamily }}
                        >
                          <h5 className="text-lg font-semibold mb-2">Indian Hills Country Club</h5>
                          <p className="text-sm opacity-90">{branding.welcomeMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Membership Tab */}
              {activeTab === 'membership' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Membership Types</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Available Membership Types</h4>
                      <button
                        onClick={addMembershipType}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Type
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {settings.membershipTypes.map((type, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{type}</span>
                          <button
                            onClick={() => removeMembershipType(type)}
                            className="text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Membership Benefits</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Access to all club facilities and amenities</li>
                      <li>• Priority booking for events and tee times</li>
                      <li>• Exclusive member-only events and tournaments</li>
                      <li>• Guest privileges and reciprocal club access</li>
                      <li>• Professional instruction and club services</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Amenities Tab */}
              {activeTab === 'amenities' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Club Amenities</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Available Amenities</h4>
                      <button
                        onClick={addAmenity}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Amenity
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {settings.amenities.map((amenity, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                          <span className="text-gray-900">{amenity}</span>
                          <button
                            onClick={() => removeAmenity(amenity)}
                            className="text-red-600 hover:text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Operating Hours Tab */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Operating Hours</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.operatingHours).map(([day, hours]) => (
                      <div key={day} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 w-24">{day}</h4>
                          <div className="flex items-center space-x-4 flex-1">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={hours.closed}
                                onChange={(e) => updateOperatingHours(day, 'closed', e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">Closed</span>
                            </label>
                            {!hours.closed && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-700">Open:</span>
                                  <input
                                    type="time"
                                    value={hours.open}
                                    onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-700">Close:</span>
                                  <input
                                    type="time"
                                    value={hours.close}
                                    onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policies Tab */}
              {activeTab === 'policies' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Club Policies</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guest Policy</label>
                      <textarea
                        value={settings.policies.guestPolicy}
                        onChange={(e) => updatePolicy('guestPolicy', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dress Code</label>
                      <textarea
                        value={settings.policies.dressCode}
                        onChange={(e) => updatePolicy('dressCode', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                      <textarea
                        value={settings.policies.cancellationPolicy}
                        onChange={(e) => updatePolicy('cancellationPolicy', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                      <textarea
                        value={settings.policies.refundPolicy}
                        onChange={(e) => updatePolicy('refundPolicy', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}