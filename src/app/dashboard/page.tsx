'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Event, Registration, EventCategory } from '@/lib/types/database'

const categoryColors: Record<EventCategory, string> = {
  Golf: 'bg-green-100 text-green-800',
  Dining: 'bg-purple-100 text-purple-800',
  Kids: 'bg-blue-100 text-blue-800',
  Fitness: 'bg-orange-100 text-orange-800',
  Social: 'bg-pink-100 text-pink-800',
}

export default function DashboardPage() {
  const { user, member, signOut } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchEvents()
      fetchRegistrations()
    }
  }, [user])

  useEffect(() => {
    if (selectedCategories.size === 0) {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter(event => 
        selectedCategories.has(event.category as EventCategory)
      ))
    }
  }, [events, selectedCategories])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (data && !error) {
      setEvents(data)
    }
    setLoading(false)
  }

  const fetchRegistrations = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('member_id', user.id)

    if (data && !error) {
      setRegistrations(data)
    }
  }

  const toggleCategory = (category: EventCategory) => {
    const newCategories = new Set(selectedCategories)
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    setSelectedCategories(newCategories)
  }

  const getRecommendedEvents = () => {
    // Simple recommendation based on member preferences
    const memberPreferences = member?.preferences as any
    const preferredCategories = memberPreferences?.categories || []
    
    return events
      .filter(event => 
        preferredCategories.includes(event.category) || 
        (memberPreferences?.familyEvents && event.category === 'Kids')
      )
      .slice(0, 5)
  }

  const isRegistered = (eventId: string) => {
    return registrations.some(reg => reg.event_id === eventId)
  }

  const handleRegister = (event: Event) => {
    if (event.registration_url) {
      window.open(event.registration_url, '_blank')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
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

  const recommendedEvents = getRecommendedEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {member?.name || 'Member'}!
              </h1>
              <p className="text-gray-600">Your personalized club dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/family'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        {/* Recommended Events Section */}
        {recommendedEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[event.category as EventCategory]
                    }`}>
                      {event.category}
                    </span>
                    {isRegistered(event.id) && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Registered
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>{formatDate(event.date)}</p>
                    <p>{formatTime(event.time)}</p>
                    <p className="font-semibold text-gray-900">${event.price}</p>
                  </div>
                  <button
                    onClick={() => handleRegister(event)}
                    disabled={isRegistered(event.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {isRegistered(event.id) ? 'Already Registered' : 'Register Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Events</h2>
          <div className="flex flex-wrap gap-3">
            {Object.keys(categoryColors).map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category as EventCategory)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategories.has(category as EventCategory)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategories.size > 0 && (
              <button
                onClick={() => setSelectedCategories(new Set())}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* All Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryColors[event.category as EventCategory]
                }`}>
                  {event.category}
                </span>
                {isRegistered(event.id) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Registered
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p>{formatDate(event.date)}</p>
                <p>{formatTime(event.time)}</p>
                <p className="font-semibold text-gray-900">${event.price}</p>
              </div>
              <button
                onClick={() => handleRegister(event)}
                disabled={isRegistered(event.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isRegistered(event.id) ? 'Already Registered' : 'Register Now'}
              </button>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}