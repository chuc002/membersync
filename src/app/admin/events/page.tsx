'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { mockEvents } from '@/lib/mock/data'
import type { MockEvent } from '@/lib/mock/data'

type EventCategory = 'Golf' | 'Dining' | 'Kids' | 'Fitness' | 'Social'

const categoryColors: Record<EventCategory, string> = {
  Golf: 'bg-green-100 text-green-800',
  Dining: 'bg-purple-100 text-purple-800',
  Kids: 'bg-blue-100 text-blue-800',
  Fitness: 'bg-orange-100 text-orange-800',
  Social: 'bg-pink-100 text-pink-800',
}

interface EventRegistration {
  id: string
  event_id: string
  member_name: string
  member_email: string
  registered_at: string
  status: 'confirmed' | 'waitlist' | 'cancelled'
}

export default function AdminEventsPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<MockEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all')
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      } else {
        loadEvents()
        loadRegistrations()
      }
    }
  }, [user, loading, isAdmin, router])

  const loadEvents = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setEvents(mockEvents)
    setPageLoading(false)
  }

  const loadRegistrations = async () => {
    // Mock registrations data
    const mockRegistrations: EventRegistration[] = [
      { id: '1', event_id: '1', member_name: 'Sarah Johnson', member_email: 'sarah.johnson@email.com', registered_at: '2024-06-15T10:30:00Z', status: 'confirmed' },
      { id: '2', event_id: '1', member_name: 'John Smith', member_email: 'john.smith@email.com', registered_at: '2024-06-15T11:15:00Z', status: 'confirmed' },
      { id: '3', event_id: '1', member_name: 'Robert Brown', member_email: 'robert.brown@email.com', registered_at: '2024-06-15T14:20:00Z', status: 'confirmed' },
      { id: '4', event_id: '2', member_name: 'Sarah Johnson', member_email: 'sarah.johnson@email.com', registered_at: '2024-06-16T09:45:00Z', status: 'confirmed' },
      { id: '5', event_id: '2', member_name: 'Lisa Wilson', member_email: 'lisa.wilson@email.com', registered_at: '2024-06-16T13:30:00Z', status: 'waitlist' },
      { id: '6', event_id: '3', member_name: 'Lisa Wilson', member_email: 'lisa.wilson@email.com', registered_at: '2024-06-17T08:15:00Z', status: 'confirmed' },
      { id: '7', event_id: '4', member_name: 'John Smith', member_email: 'john.smith@email.com', registered_at: '2024-06-17T16:45:00Z', status: 'confirmed' },
      { id: '8', event_id: '5', member_name: 'Sarah Johnson', member_email: 'sarah.johnson@email.com', registered_at: '2024-06-18T07:30:00Z', status: 'confirmed' },
    ]
    setRegistrations(mockRegistrations)
  }

  if (loading || pageLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getEventRegistrations = (eventId: string) => {
    return registrations.filter(reg => reg.event_id === eventId)
  }

  const getEventStats = (event: MockEvent) => {
    const eventRegistrations = getEventRegistrations(event.id)
    return {
      totalRegistrations: eventRegistrations.length,
      confirmedRegistrations: eventRegistrations.filter(r => r.status === 'confirmed').length,
      waitlistRegistrations: eventRegistrations.filter(r => r.status === 'waitlist').length,
      revenue: eventRegistrations.filter(r => r.status === 'confirmed').length * event.price
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600">Create and manage club events</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-blue-600">{events.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-3xl font-bold text-green-600">{registrations.filter(r => r.status === 'confirmed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waitlist</p>
                <p className="text-3xl font-bold text-orange-600">{registrations.filter(r => r.status === 'waitlist').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${events.reduce((total, event) => total + getEventStats(event).revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Events Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Events List</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Event
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as EventCategory | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Golf">Golf</option>
                <option value="Dining">Dining</option>
                <option value="Kids">Kids</option>
                <option value="Fitness">Fitness</option>
                <option value="Social">Social</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const stats = getEventStats(event)
              return (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[event.category as EventCategory]
                    }`}>
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${event.price}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p>{formatTime(event.time)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{stats.confirmedRegistrations}</div>
                      <div className="text-gray-500">Registered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">${stats.revenue}</div>
                      <div className="text-gray-500">Revenue</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Event Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="text-gray-900">{selectedEvent.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedEvent.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <p className="text-gray-900">{formatDate(selectedEvent.date)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <p className="text-gray-900">{formatTime(selectedEvent.time)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          categoryColors[selectedEvent.category as EventCategory]
                        }`}>
                          {selectedEvent.category}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <p className="text-gray-900 font-semibold">${selectedEvent.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Registration Details</h4>
                  {(() => {
                    const eventRegs = getEventRegistrations(selectedEvent.id)
                    const stats = getEventStats(selectedEvent)
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalRegistrations}</div>
                            <div className="text-sm text-blue-600">Total</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-600">{stats.confirmedRegistrations}</div>
                            <div className="text-sm text-green-600">Confirmed</div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-orange-600">{stats.waitlistRegistrations}</div>
                            <div className="text-sm text-orange-600">Waitlist</div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Recent Registrations</h5>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {eventRegs.slice(0, 10).map((reg) => (
                              <div key={reg.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                <div>
                                  <div className="font-medium text-sm">{reg.member_name}</div>
                                  <div className="text-xs text-gray-600">{reg.member_email}</div>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    reg.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    reg.status === 'waitlist' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {reg.status}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(reg.registered_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Event
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Export Registrations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select category</option>
                      <option value="Golf">Golf</option>
                      <option value="Dining">Dining</option>
                      <option value="Kids">Kids</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.ihcckc.com/events/..."
                  />
                </div>
              </form>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}