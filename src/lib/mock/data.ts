export interface MockMember {
  id: string
  email: string
  name: string
  phone?: string
  club_id: string
  role: 'member' | 'admin'
  preferences: {
    categories: string[]
    notifications: {
      email: boolean
      sms: boolean
      reminders: boolean
    }
    familyEvents: boolean
  }
  family_members: MockFamilyMember[]
  created_at: string
}

export interface MockFamilyMember {
  name: string
  age: number
  relationship: string
  notificationPreferences: {
    email: boolean
    sms: boolean
  }
}

export interface MockEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  category: string
  price: number
  registration_url: string
  club_id: string
  created_at: string
}

export interface MockRegistration {
  id: string
  member_id: string
  event_id: string
  status: string
  registered_at: string
}

// Mock Events Data
export const mockEvents: MockEvent[] = [
  {
    id: '1',
    title: 'Golf Tournament - Member Guest',
    description: 'Annual member-guest golf tournament with prizes and dinner. Join us for a day of friendly competition on our championship course.',
    date: '2025-07-25',
    time: '08:00:00',
    category: 'Golf',
    price: 125.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844355',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '2',
    title: 'Wine Tasting Dinner',
    description: 'Five-course dinner paired with premium wines from Napa Valley. An evening of culinary excellence.',
    date: '2025-07-28',
    time: '18:30:00',
    category: 'Dining',
    price: 89.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844356',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '3',
    title: 'Kids Swimming Lessons',
    description: 'Learn to swim program for children ages 5-12. Professional instruction in our heated indoor pool.',
    date: '2025-07-30',
    time: '16:00:00',
    category: 'Kids',
    price: 45.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844357',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '4',
    title: 'Fitness Boot Camp',
    description: 'High-intensity interval training session led by certified trainers. All fitness levels welcome.',
    date: '2025-08-02',
    time: '06:00:00',
    category: 'Fitness',
    price: 25.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844358',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '5',
    title: 'New Year Social Mixer',
    description: 'Welcome the new year with fellow members. Cocktails, appetizers, and live music.',
    date: '2025-08-05',
    time: '19:00:00',
    category: 'Social',
    price: 35.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844359',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '6',
    title: 'Ladies Golf Clinic',
    description: 'Improve your golf game with professional instruction. Beginner to intermediate levels.',
    date: '2025-08-08',
    time: '10:00:00',
    category: 'Golf',
    price: 65.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844360',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '7',
    title: 'Valentine\'s Day Dinner',
    description: 'Romantic dinner for couples featuring a special menu and live piano music.',
    date: '2025-08-14',
    time: '18:00:00',
    category: 'Dining',
    price: 95.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844361',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '8',
    title: 'Kids Art Workshop',
    description: 'Creative art activities for children. All supplies provided. Perfect for budding artists.',
    date: '2025-08-17',
    time: '14:00:00',
    category: 'Kids',
    price: 20.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844362',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '9',
    title: 'Tennis Championship',
    description: 'Annual tennis tournament open to all skill levels. Trophies for winners in each division.',
    date: '2025-08-15',
    time: '09:00:00',
    category: 'Fitness',
    price: 40.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844363',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '10',
    title: 'Cocktail Making Class',
    description: 'Learn to craft professional cocktails from our expert bartenders. Recipe cards included.',
    date: '2025-08-20',
    time: '17:00:00',
    category: 'Social',
    price: 55.00,
    registration_url: 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844364',
    club_id: 'IHCC',
    created_at: '2024-12-18T00:00:00Z'
  }
]

// Pre-defined demo users
export const demoUsers: MockMember[] = [
  {
    id: 'member-1',
    email: 'sarah.johnson@email.com',
    name: 'Sarah Johnson',
    phone: '(555) 123-4567',
    club_id: 'IHCC',
    role: 'member',
    preferences: {
      categories: ['Golf', 'Social'],
      notifications: { email: true, sms: true, reminders: true },
      familyEvents: true
    },
    family_members: [
      {
        name: 'Mike Johnson',
        age: 45,
        relationship: 'spouse',
        notificationPreferences: { email: true, sms: false }
      },
      {
        name: 'Emma Johnson',
        age: 12,
        relationship: 'child',
        notificationPreferences: { email: false, sms: false }
      }
    ],
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'member-2',
    email: 'john.smith@email.com',
    name: 'John Smith',
    phone: '(555) 987-6543',
    club_id: 'IHCC',
    role: 'member',
    preferences: {
      categories: ['Fitness', 'Dining'],
      notifications: { email: true, sms: false, reminders: true },
      familyEvents: false
    },
    family_members: [],
    created_at: '2024-02-20T00:00:00Z'
  },
  {
    id: 'admin-1',
    email: 'admin@ihcckc.com',
    name: 'IHCC Staff Admin',
    phone: '(555) 555-0001',
    club_id: 'IHCC',
    role: 'admin',
    preferences: {
      categories: [],
      notifications: { email: true, sms: true, reminders: true },
      familyEvents: false
    },
    family_members: [],
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'admin-2',
    email: 'manager@ihcckc.com',
    name: 'Club Manager',
    phone: '(555) 555-0002',
    club_id: 'IHCC',
    role: 'admin',
    preferences: {
      categories: [],
      notifications: { email: true, sms: false, reminders: true },
      familyEvents: false
    },
    family_members: [],
    created_at: '2023-01-01T00:00:00Z'
  }
]

// Mock storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'membersync_current_user',
  MEMBERS: 'membersync_members',
  REGISTRATIONS: 'membersync_registrations',
  EVENTS: 'membersync_events'
}