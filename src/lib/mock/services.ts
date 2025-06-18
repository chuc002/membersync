import { mockEvents, MockMember, MockEvent, MockRegistration, STORAGE_KEYS, demoUsers } from './data'

// Mock Authentication Service
export class MockAuthService {
  static getCurrentUser(): MockMember | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return userStr ? JSON.parse(userStr) : null
  }

  static async signUp(email: string, password: string, userData: Partial<MockMember>): Promise<{ user: MockMember | null; error: string | null }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUsers = this.getAllMembers()
      if (existingUsers.find(u => u.email === email)) {
        return { user: null, error: 'User already exists with this email' }
      }

      const newUser: MockMember = {
        id: Date.now().toString(),
        email,
        name: userData.name || '',
        phone: userData.phone,
        club_id: 'IHCC',
        role: 'member', // New users are members by default
        preferences: userData.preferences || {
          categories: [],
          notifications: { email: true, sms: false, reminders: true },
          familyEvents: true
        },
        family_members: userData.family_members || [],
        created_at: new Date().toISOString()
      }

      // Save only new users to localStorage (demo users are always available)
      const storedMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS)
      const existingStored = storedMembers ? JSON.parse(storedMembers) : []
      existingStored.push(newUser)
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(existingStored))
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))
      
      // Trigger auth state change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }

      return { user: newUser, error: null }
    } catch (error) {
      return { user: null, error: 'Failed to create account' }
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: MockMember | null; error: string | null }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const users = this.getAllMembers()
      const user = users.find(u => u.email === email)

      if (!user) {
        return { user: null, error: 'Invalid email or password' }
      }

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      
      // Trigger auth state change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
      
      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'Failed to sign in' }
    }
  }

  static async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    
    // Trigger auth state change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
  }

  static async resetPassword(email: string): Promise<{ error: string | null }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = this.getAllMembers()
    const user = users.find(u => u.email === email)

    if (!user) {
      return { error: 'No account found with this email address' }
    }

    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`)
    return { error: null }
  }

  private static getAllMembers(): MockMember[] {
    if (typeof window === 'undefined') return demoUsers
    const membersStr = localStorage.getItem(STORAGE_KEYS.MEMBERS)
    const storedMembers = membersStr ? JSON.parse(membersStr) : []
    // Merge demo users with any registered users, avoiding duplicates
    const allMembers = [...demoUsers]
    storedMembers.forEach((stored: MockMember) => {
      if (!allMembers.find(demo => demo.email === stored.email)) {
        allMembers.push(stored)
      }
    })
    return allMembers
  }

  static updateMember(updatedMember: MockMember): void {
    const users = this.getAllMembers()
    const index = users.findIndex(u => u.id === updatedMember.id)
    if (index !== -1) {
      users[index] = updatedMember
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(users))
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedMember))
    }
  }
}

// Mock Events Service
export class MockEventsService {
  static getEvents(): MockEvent[] {
    // Return mock events, filtering to show only future events
    const today = new Date().toISOString().split('T')[0]
    const futureEvents = mockEvents.filter(event => event.date >= today)
    console.log('MockEventsService.getEvents():', {
      today,
      totalEvents: mockEvents.length,
      futureEvents: futureEvents.length,
      events: futureEvents.map(e => ({ id: e.id, title: e.title, date: e.date, category: e.category }))
    })
    return futureEvents
  }

  static getEvent(id: string): MockEvent | null {
    return mockEvents.find(event => event.id === id) || null
  }

  static getEventsByCategory(category: string): MockEvent[] {
    return this.getEvents().filter(event => event.category === category)
  }

  static getRecommendedEvents(member: MockMember): MockEvent[] {
    const allEvents = this.getEvents()
    const preferences = member.preferences

    return allEvents.filter(event => {
      // Check if event category matches preferences
      if (preferences.categories.includes(event.category)) {
        return true
      }
      
      // Include family events if enabled
      if (preferences.familyEvents && (event.category === 'Kids' || event.category === 'Social')) {
        return true
      }
      
      return false
    }).slice(0, 5)
  }
}

// Mock Registrations Service
export class MockRegistrationsService {
  static getRegistrations(memberId: string): MockRegistration[] {
    if (typeof window === 'undefined') return []
    const registrationsStr = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)
    const allRegistrations = registrationsStr ? JSON.parse(registrationsStr) : []
    return allRegistrations.filter((reg: MockRegistration) => reg.member_id === memberId)
  }

  static isRegistered(memberId: string, eventId: string): boolean {
    const registrations = this.getRegistrations(memberId)
    return registrations.some(reg => reg.event_id === eventId && reg.status === 'registered')
  }

  static register(memberId: string, eventId: string): MockRegistration {
    const registration: MockRegistration = {
      id: Date.now().toString(),
      member_id: memberId,
      event_id: eventId,
      status: 'registered',
      registered_at: new Date().toISOString()
    }

    const allRegistrations = this.getAllRegistrations()
    allRegistrations.push(registration)
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(allRegistrations))

    return registration
  }

  static unregister(memberId: string, eventId: string): void {
    const allRegistrations = this.getAllRegistrations()
    const filtered = allRegistrations.filter((reg: MockRegistration) => 
      !(reg.member_id === memberId && reg.event_id === eventId)
    )
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered))
  }

  private static getAllRegistrations(): MockRegistration[] {
    if (typeof window === 'undefined') return []
    const registrationsStr = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)
    return registrationsStr ? JSON.parse(registrationsStr) : []
  }
}

// Mock Notifications Service
export class MockNotificationsService {
  static async sendWelcomeEmail(member: MockMember): Promise<boolean> {
    console.log(`📧 Welcome email sent to ${member.email}`)
    return true
  }

  static async sendEventNotification(member: MockMember, event: MockEvent): Promise<boolean> {
    console.log(`📧 Event notification sent to ${member.email} for ${event.title}`)
    return true
  }

  static async sendSMS(member: MockMember, message: string): Promise<boolean> {
    if (member.phone && member.preferences.notifications.sms) {
      console.log(`📱 SMS sent to ${member.phone}: ${message}`)
      return true
    }
    return false
  }

  static async sendRegistrationConfirmation(member: MockMember, event: MockEvent): Promise<boolean> {
    console.log(`📧 Registration confirmation sent to ${member.email} for ${event.title}`)
    return true
  }
}