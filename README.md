# MemberSync

A comprehensive club management system for Indian Hills Country Club (IHCC) featuring role-based access control, event management, family management, and real-time notifications.

## 🌟 Features

### Member Portal
- **Event Discovery**: Browse and filter events by Golf, Dining, Kids, Fitness, and Social categories
- **Personalized Recommendations**: AI-powered event suggestions based on member preferences
- **Family Management**: Add family members with individual notification preferences
- **Profile Management**: Update personal information and event preferences
- **Event Registration**: One-click registration with external IHCC system integration
- **Mobile Responsive**: Optimized for all device sizes

### Admin Dashboard
- **Member Management**: View and manage all club members
- **Event Management**: Create, edit, and monitor events
- **Analytics & Reporting**: Real-time insights into member engagement
- **Club Administration**: Comprehensive club settings and management
- **Notification System**: Bulk email and SMS capabilities

### Technical Features
- **Role-Based Access Control**: Separate interfaces for members and staff
- **Mock Services**: Complete demo functionality without external dependencies
- **Real-time Updates**: Instant state synchronization across tabs
- **Type-Safe**: Full TypeScript implementation
- **Modern UI**: Tailwind CSS with responsive design
- **Performance Optimized**: Next.js App Router with static generation

## 🚀 Live Demo

**Production**: [https://membersync-fjms17y01-chase-lucas-projects.vercel.app](https://membersync-fjms17y01-chase-lucas-projects.vercel.app)

### Demo Credentials

#### Member Access
- **Email**: `sarah.johnson@email.com`
- **Password**: `password`
- **Features**: Event browsing, family management, profile settings

#### Staff Access
- **Email**: `admin@ihcckc.com`
- **Password**: `admin`
- **Features**: Member management, event administration, analytics

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom role-based auth with localStorage
- **State Management**: React Context API
- **Deployment**: Vercel
- **Data**: Mock services with localStorage persistence

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/membersync.git
   cd membersync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required for production (optional for demo)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email notifications (Resend)
RESEND_API_KEY=your_resend_api_key

# SMS notifications (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# API Security
SYNC_API_KEY=your_secure_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

**Note**: The demo works completely without environment variables using mock services.

## 🏗 Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── dashboard/         # Member dashboard
│   ├── family/            # Family management
│   ├── login/             # Authentication
│   ├── profile/           # Member profile
│   └── signup/            # Member registration
├── components/            # Shared React components
│   └── AuthProvider.tsx  # Authentication context
├── lib/                   # Utility libraries
│   ├── mock/             # Mock services and data
│   │   ├── data.ts       # Sample data and types
│   │   └── services.ts   # Mock API services
│   └── validation.ts     # Form validation
└── middleware.ts          # Route protection
```

### Authentication Flow
1. **Role Detection**: System identifies user role (member/admin)
2. **Route Protection**: Middleware redirects based on role
3. **State Management**: React Context manages auth state
4. **Persistence**: localStorage maintains sessions

### Data Flow
1. **Mock Services**: Simulate real API behavior
2. **Local Storage**: Persist user data and preferences
3. **Real-time Updates**: Event-driven state synchronization
4. **Type Safety**: Full TypeScript coverage

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables**
   - Go to Vercel dashboard
   - Add environment variables from `.env.example`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Mobile Support

MemberSync is fully responsive and optimized for:
- iOS Safari
- Android Chrome
- Mobile web browsers
- Tablet interfaces

## 🔐 Security Features

- **Role-based access control**
- **Route protection middleware**
- **Input validation and sanitization**
- **XSS protection**
- **CSRF protection**
- **Secure authentication flow**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Role-based authentication
- ✅ Event management system
- ✅ Family management
- ✅ Mock services implementation

### Phase 2 (Next)
- 🔄 Supabase integration
- 🔄 Real-time notifications
- 🔄 Payment processing
- 🔄 Calendar integration

### Phase 3 (Future)
- 📋 Mobile app (React Native)
- 📋 Advanced analytics
- 📋 Multi-club support
- 📋 API documentation

## 🐛 Known Issues

- Mock data resets on browser cache clear
- Email notifications are console-logged (demo mode)
- SMS features require Twilio setup for production

## 📞 Support

For questions or support:
- Create an issue in this repository
- Email: support@membersync.app
- Documentation: [GitHub Wiki](https://github.com/YOUR_USERNAME/membersync/wiki)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform
- [Indian Hills Country Club](https://www.ihcckc.com/) - Inspiration and requirements

---

**Built with ❤️ for Indian Hills Country Club**