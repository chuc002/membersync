'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { FamilyMember, Event, Registration } from '@/lib/types/database'

export default function FamilyPage() {
  const { user, member, signOut } = useAuth()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [familyRegistrations, setFamilyRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (member) {
      const familyData = member.family_members as FamilyMember[]
      setFamilyMembers(familyData || [])
      fetchEvents()
      fetchFamilyRegistrations()
      setLoading(false)
    }
  }, [member])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (data && !error) {
      setEvents(data)
    }
  }

  const fetchFamilyRegistrations = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('member_id', user.id)

    if (data && !error) {
      setFamilyRegistrations(data)
    }
  }

  const saveFamilyMembers = async (updatedMembers: FamilyMember[]) => {
    if (!user) return

    const { error } = await supabase
      .from('members')
      .update({ family_members: updatedMembers })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating family members:', error)
    } else {
      setFamilyMembers(updatedMembers)
    }
  }

  const addFamilyMember = async (newMember: FamilyMember) => {
    const updatedMembers = [...familyMembers, newMember]
    await saveFamilyMembers(updatedMembers)
    setShowAddForm(false)
  }

  const updateFamilyMember = async (index: number, updatedMember: FamilyMember) => {
    const updatedMembers = [...familyMembers]
    updatedMembers[index] = updatedMember
    await saveFamilyMembers(updatedMembers)
    setEditingMember(null)
  }

  const removeFamilyMember = async (index: number) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index)
    await saveFamilyMembers(updatedMembers)
  }

  const getFamilyEvents = () => {
    return events.filter(event => event.category === 'Kids' || event.category === 'Social')
  }

  const isRegisteredForEvent = (eventId: string) => {
    return familyRegistrations.some(reg => reg.event_id === eventId)
  }

  const registerForEvent = (event: Event) => {
    if (event.registration_url) {
      window.open(event.registration_url, '_blank')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const familyEvents = getFamilyEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
              <p className="text-gray-600">Manage your family members and registrations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Family Members Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Family Members</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
            </div>

            {/* Add Family Member Form */}
            {showAddForm && (
              <AddFamilyMemberForm
                onAdd={addFamilyMember}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {/* Family Members List */}
            <div className="space-y-4">
              {familyMembers.map((familyMember, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  {editingMember === index ? (
                    <EditFamilyMemberForm
                      member={familyMember}
                      onSave={(updated) => updateFamilyMember(index, updated)}
                      onCancel={() => setEditingMember(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{familyMember.name}</h3>
                        <p className="text-sm text-gray-600">
                          {familyMember.relationship} • Age {familyMember.age}
                        </p>
                        <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                          <span>
                            Email: {familyMember.notificationPreferences.email ? '✓' : '✗'}
                          </span>
                          <span>
                            SMS: {familyMember.notificationPreferences.sms ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingMember(index)}
                          className="text-blue-600 hover:text-blue-500 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeFamilyMember(index)}
                          className="text-red-600 hover:text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {familyMembers.length === 0 && !showAddForm && (
                <div className="text-center py-8 text-gray-500">
                  <p>No family members added yet.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-blue-600 hover:text-blue-500 mt-2"
                  >
                    Add your first family member
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Family Events Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Family-Friendly Events</h2>
            
            <div className="space-y-4">
              {familyEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.category === 'Kids' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="text-sm text-gray-500">
                        <p>{formatDate(event.date)} at {formatTime(event.time)}</p>
                        <p className="font-semibold text-gray-900">${event.price}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isRegisteredForEvent(event.id) ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => registerForEvent(event)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {familyEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No family events currently scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddFamilyMemberForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (member: FamilyMember) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState<FamilyMember>({
    name: '',
    age: 0,
    relationship: '',
    notificationPreferences: {
      email: false,
      sms: false,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.age && formData.relationship) {
      onAdd(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <h3 className="font-medium text-gray-900 mb-4">Add Family Member</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age || ''}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <select
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Relationship</option>
          <option value="spouse">Spouse</option>
          <option value="child">Child</option>
          <option value="parent">Parent</option>
          <option value="sibling">Sibling</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notificationPreferences.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    email: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            Email notifications
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notificationPreferences.sms}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    sms: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            SMS notifications
          </label>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  )
}

function EditFamilyMemberForm({ 
  member, 
  onSave, 
  onCancel 
}: { 
  member: FamilyMember
  onSave: (member: FamilyMember) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState<FamilyMember>(member)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <select
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="spouse">Spouse</option>
          <option value="child">Child</option>
          <option value="parent">Parent</option>
          <option value="sibling">Sibling</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notificationPreferences.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    email: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            Email notifications
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notificationPreferences.sms}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    sms: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            SMS notifications
          </label>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
}