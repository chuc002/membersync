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
  location: string
  url: string
}

export interface MockRegistration {
  id: string
  member_id: string
  event_id: string
  status: string
  registered_at: string
}

// Real IHCC Events Data - Imported from CSV
export const mockEvents: MockEvent[] = [
  {
    id: 'ihcc-1',
    title: 'WoW Day #2 5:15 AM',
    description: 'Women on Weights is a strength training program targeting women of all levels, get stronger together! Spaces are limited and you must be registered. This 8-week program includes: pre-and post-assessment • 60-minute Strength Training 2x\'s / week Led by IHCC personal trainer • Group Class of choice 2x\'s / week • Individualized macronutrient plan • Tracking card for accountability.',
    date: '6-20-2025',
    time: '5:15AM',
    category: 'Fitness',
    price: 20,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/wow-day-2-5-15-am'
  },
  {
    id: 'ihcc-2',
    title: 'WoW Day #2 6:00 AM',
    description: 'Women on Weights is a strength training program targeting women of all levels, get stronger together! Spaces are limited and you must be registered. This 8-week program includes: pre-and post-assessment • 60-minute Strength Training 2x\'s / week Led by IHCC personal trainer • Group Class of choice 2x\'s / week • Individualized macronutrient plan • Tracking card for accountability.',
    date: '6-20-2025',
    time: '6:00AM',
    category: 'Fitness',
    price: 20,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/wow-day-2-6-00-am'
  },
  {
    id: 'ihcc-3',
    title: 'Cardio Sculpt 7:00 AM',
    description: 'A great way to sweat and sculpt while building aerobic capacity. The exercises will keep you moving, sweating, and having fun!',
    date: '6-20-2025',
    time: '7:00AM',
    category: 'Fitness',
    price: 15,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/cardio-sculpt-7-00-am'
  },
  {
    id: 'ihcc-4',
    title: 'Deep H2O Conditioning (@ the pool) 7:00 AM',
    description: 'Build power, strength, flexibility, balance, and mobility through leveraged body weight exercise.',
    date: '6-20-2025',
    time: '7:00AM',
    category: 'Fitness',
    price: 18,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/deep-h2o-conditioning-@-the-pool-7-00-am'
  },
  {
    id: 'ihcc-5',
    title: '8am Cardio Clinic',
    description: 'High-intensity cardio workout session designed to boost your cardiovascular fitness and energy levels.',
    date: '6-20-2025',
    time: '8:00AM',
    category: 'Fitness',
    price: 12,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/8am-cardio-clinic'
  },
  {
    id: 'ihcc-6',
    title: 'Barre Fitness 8:30 AM',
    description: 'A low-impact workout focuses on isometric exercises that will strengthen your legs, core, and back while improving your posture and flexibility.',
    date: '6-20-2025',
    time: '8:30AM',
    category: 'Fitness',
    price: 22,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/barre-fitness-8-30-am'
  },
  {
    id: 'ihcc-7',
    title: '9am Cardio Clinic',
    description: 'Morning cardio session to start your day with energy and motivation. Perfect for all fitness levels.',
    date: '6-20-2025',
    time: '9:00AM',
    category: 'Fitness',
    price: 12,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/9am-cardio-clinic'
  },
  {
    id: 'ihcc-8',
    title: 'Tennis Ball Foot Massage Mini-Clinic',
    description: 'Complimentary mini-clinic on the Tennis Deck! Learn self-massage techniques for foot relief and wellness.',
    date: '6-20-2025',
    time: '9:00AM',
    category: 'Fitness',
    price: 0,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/tennis-ball-foot-massage-mini-clinic'
  },
  {
    id: 'ihcc-9',
    title: 'WoW Day #2 11:00 AM',
    description: 'Women on Weights is a strength training program targeting women of all levels, get stronger together! Spaces are limited and you must be registered. This 8-week program includes: pre-and post-assessment • 60-minute Strength Training 2x\'s / week Led by IHCC personal trainer • Group Class of choice 2x\'s / week.',
    date: '6-20-2025',
    time: '11:00AM',
    category: 'Fitness',
    price: 20,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/wow-day-2-11-00-am'
  },
  {
    id: 'ihcc-10',
    title: 'Jr. Tennis Member-Guest',
    description: 'Invite a friend for tennis, pizza, drinks, and prizes! $25++ per person',
    date: '6-20-2025',
    time: '6:00PM',
    category: 'Kids',
    price: 25,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/jr-tennis-member-guest'
  },
  {
    id: 'ihcc-11',
    title: '8:30 am Cardio Clinic',
    description: 'Extended morning cardio session to energize your weekend. Great for building endurance and cardiovascular health.',
    date: '6-21-2025',
    time: '8:30AM',
    category: 'Fitness',
    price: 12,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/8-30-am-cardio-clinic'
  },
  {
    id: 'ihcc-12',
    title: 'Circuit Training 8:30 AM',
    description: 'A metabolism boosting workout utilizing multiple joint movements and full body exercises performed at a high intensity, formatted in a circuit style class. The exercises are constantly changing, forcing you to use your whole body as a unit.',
    date: '6-21-2025',
    time: '8:30AM',
    category: 'Fitness',
    price: 18,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/circuit-training-8-30-am'
  },
  {
    id: 'ihcc-13',
    title: 'AQUA FIT (@ the pool) 9:00 AM',
    description: 'Build power, strength, flexibility, balance, and mobility through leveraged body weight exercise in the pool.',
    date: '6-22-2025',
    time: '9:00AM',
    category: 'Fitness',
    price: 15,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/aqua-fit-@-the-pool-9-00-am'
  },
  {
    id: 'ihcc-14',
    title: 'Father-Son Night of Fun!',
    description: 'Dads and sons, join us for laser tag, zorb ball bowling, sumo suit wrestling, food, and fun! Dads - $45 and Sons - $30',
    date: '6-22-2025',
    time: '5:00PM',
    category: 'Kids',
    price: 45,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/father-son-night-of-fun'
  },
  {
    id: 'ihcc-15',
    title: 'WoW Day #1 5:30 AM',
    description: 'Women on Weights is a strength training program targeting women of all levels, get stronger together! Spaces are limited and you must be registered. This 8-week program includes: pre-and post-assessment • 60-minute Strength Training 2x\'s / week Led by IHCC personal trainer.',
    date: '6-23-2025',
    time: '5:30AM',
    category: 'Fitness',
    price: 20,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/wow-day-1-5-30-am'
  },
  {
    id: 'ihcc-16',
    title: 'Circuit Training 7:00 AM',
    description: 'A metabolism boosting workout utilizing multiple joint movements and full body exercises performed at a high intensity, formatted in a circuit style class. The exercises are constantly changing, forcing you to use your whole body as a unit.',
    date: '6-23-2025',
    time: '7:00AM',
    category: 'Fitness',
    price: 18,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/circuit-training-7-00-am'
  },
  {
    id: 'ihcc-17',
    title: 'Deep H2O Conditioning (@ the pool) 7:00 AM',
    description: 'Build power, strength, flexibility, balance, and mobility through leveraged body weight exercise in our pool facilities.',
    date: '6-23-2025',
    time: '7:00AM',
    category: 'Fitness',
    price: 18,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/deep-h2o-conditioning-@-the-pool-7-00-am'
  },
  {
    id: 'ihcc-18',
    title: 'Body Sculpt 8:30 AM',
    description: 'A great way to define, sculpt, and build lean muscle. Focuses on strength training with isolation exercises using free weights, resistance bands, medicine balls, ending with core strength.',
    date: '6-23-2025',
    time: '8:30AM',
    category: 'Fitness',
    price: 20,
    location: 'Indian Hills CC',
    url: 'https://www.ihcckc.com/events/body-sculpt-8-30-am'
  }
]

// Utility function to get events by category for filtering
export const getEventsByCategory = (category: string): MockEvent[] => {
  if (category === 'all') return mockEvents
  return mockEvents.filter(event => event.category.toLowerCase() === category.toLowerCase())
}

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