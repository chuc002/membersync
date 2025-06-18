# MemberSync Production Setup Guide

## 1. Supabase Database Setup

### Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New Project"
3. Choose organization and enter project details:
   - **Project Name**: `membersync-ihcc`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to Kansas City (US Central)
4. Wait for project creation (2-3 minutes)

### Get Project Credentials
After project creation, go to **Settings** → **API**:
- **Project URL**: `https://[your-project-id].supabase.co`
- **Anon Public Key**: `eyJ...` (long string starting with eyJ)
- **Service Role Key**: `eyJ...` (different long string, keep secret!)

### Run Database Migration
1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the migration SQL below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create members table
CREATE TABLE public.members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    club_id TEXT,
    preferences JSONB DEFAULT '{}',
    family_members JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create events table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    registration_url TEXT,
    club_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create registrations table
CREATE TABLE public.registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(member_id, event_id)
);

-- Create indexes for better performance
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_registrations_member_id ON public.registrations(member_id);
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for members table
CREATE POLICY "Users can view their own profile" ON public.members
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.members
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.members
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for events table (public read)
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT USING (true);

-- Create policies for registrations table
CREATE POLICY "Users can view their own registrations" ON public.registrations
    FOR SELECT USING (auth.uid() = member_id);

CREATE POLICY "Users can create their own registrations" ON public.registrations
    FOR INSERT WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own registrations" ON public.registrations
    FOR UPDATE USING (auth.uid() = member_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample events data
INSERT INTO public.events (title, description, date, time, category, price, registration_url, club_id) VALUES
('Golf Tournament - Member Guest', 'Annual member-guest golf tournament with prizes and dinner', '2024-12-25', '08:00:00', 'Golf', 125.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844355', 'IHCC'),
('Wine Tasting Dinner', 'Five-course dinner paired with premium wines', '2024-12-28', '18:30:00', 'Dining', 89.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844356', 'IHCC'),
('Kids Swimming Lessons', 'Learn to swim program for children ages 5-12', '2024-12-30', '16:00:00', 'Kids', 45.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844357', 'IHCC'),
('Fitness Boot Camp', 'High-intensity interval training session', '2025-01-02', '06:00:00', 'Fitness', 25.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844358', 'IHCC'),
('New Year Social Mixer', 'Welcome the new year with fellow members', '2025-01-05', '19:00:00', 'Social', 35.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844359', 'IHCC'),
('Ladies Golf Clinic', 'Improve your golf game with professional instruction', '2025-01-08', '10:00:00', 'Golf', 65.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844360', 'IHCC'),
('Valentine''s Day Dinner', 'Romantic dinner for couples', '2025-02-14', '18:00:00', 'Dining', 95.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844361', 'IHCC'),
('Kids Art Workshop', 'Creative art activities for children', '2025-02-17', '14:00:00', 'Kids', 20.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844362', 'IHCC');
```

4. Click "Run" to execute the migration
5. Verify tables were created in **Table Editor**

### Configure Authentication
1. Go to **Authentication** → **Settings**
2. **Site URL**: `https://membersync.vercel.app`
3. **Redirect URLs**: Add `https://membersync.vercel.app/dashboard`
4. Enable **Email confirmations** if desired
5. Configure **Email templates** with IHCC branding

---

## 2. Twilio SMS Setup

### Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for account
3. Verify phone number
4. Get $15 trial credit

### Get Credentials
1. Go to **Console Dashboard**
2. Note these values:
   - **Account SID**: `AC...` (starts with AC)
   - **Auth Token**: Click "show" to reveal
3. Go to **Phone Numbers** → **Manage** → **Buy a number**
4. Purchase a US phone number for SMS
5. Note the **Phone Number**: `+1...`

### Configure Messaging
1. Go to **Messaging** → **Settings** → **WhatsApp sandbox** (optional)
2. Configure **Copilot** for message routing (optional)
3. Set up **Status callbacks** to monitor delivery

---

## 3. Resend Email Setup

### Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with email
3. Verify email address

### Get API Key
1. Go to **API Keys**
2. Click "Create API Key"
3. Name: `MemberSync Production`
4. Copy the API key (starts with `re_`)

### Add Domain (Optional)
1. Go to **Domains**
2. Add `ihcckc.com` if you have access
3. Follow DNS verification steps
4. Or use default `@resend.dev` sender

---

## 4. Vercel Environment Variables

### Configure Production Variables
1. Go to [vercel.com](https://vercel.com) → Your Project → Settings → Environment Variables
2. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key | Production |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Production |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Production |
| `TWILIO_PHONE_NUMBER` | Your Twilio Phone Number | Production |
| `RESEND_API_KEY` | Your Resend API Key | Production |
| `NEXTAUTH_URL` | `https://membersync.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Generate random 32-char string | Production |
| `SYNC_API_KEY` | Generate random API key for cron | Production |

### Generate Secure Keys
Use these commands to generate secure keys:
```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For SYNC_API_KEY  
openssl rand -hex 32
```

---

## 5. Deploy Updated Application

1. Commit any final changes to your git repository
2. Push to main branch (triggers auto-deploy)
3. Or run manual deploy: `vercel --prod`
4. Verify deployment at your Vercel URL

---

## 6. Testing Checklist

### Authentication Testing
- [ ] Member signup with email/password
- [ ] Email verification (if enabled)
- [ ] Member login/logout
- [ ] Password reset functionality
- [ ] Protected route redirects

### Event Management Testing
- [ ] Events display on dashboard
- [ ] Event filtering by category
- [ ] Event registration buttons work
- [ ] Recommended events show based on preferences

### Family Management Testing
- [ ] Add family members
- [ ] Edit family member details
- [ ] Family event filtering
- [ ] Family notification preferences

### Notification Testing
- [ ] Welcome email on signup
- [ ] SMS notifications (if phone provided)
- [ ] Event recommendation emails
- [ ] Registration confirmation emails

### Mobile Responsiveness
- [ ] Login/signup forms on mobile
- [ ] Dashboard layout on mobile
- [ ] Family management on mobile
- [ ] Event cards responsive design

---

## 7. Go Live Process

### Final Pre-Launch Steps
1. **Custom Domain** (Optional):
   - Purchase domain: `membersync.ihcckc.com`
   - Configure DNS in Vercel
   - Update environment variables

2. **SSL Certificate**:
   - Automatic with Vercel
   - Verify HTTPS redirect works

3. **Analytics Setup**:
   - Add Google Analytics to Vercel
   - Configure Vercel Analytics
   - Set up Supabase Analytics

4. **Monitoring**:
   - Configure Vercel monitoring alerts
   - Set up Supabase database alerts
   - Monitor Twilio usage limits

### Staff Training Requirements
1. **Admin Training** (1 hour):
   - How to view member registrations
   - Managing events in Supabase
   - Understanding notification logs

2. **Content Management** (30 minutes):
   - Updating event information
   - Managing member communications
   - Handling support requests

### Launch Communication
1. **Soft Launch** (Week 1):
   - Invite 10-20 test members
   - Gather feedback
   - Fix any issues

2. **Full Launch** (Week 2):
   - Email all IHCC members
   - Social media announcement
   - Website integration

---

## Support and Maintenance

### Regular Tasks
- **Weekly**: Review new member signups
- **Monthly**: Check notification delivery rates
- **Quarterly**: Review event engagement analytics

### Technical Maintenance
- **Database**: Automatic backups enabled in Supabase
- **Security**: Regular dependency updates
- **Performance**: Monitor Vercel function execution times

### Troubleshooting Common Issues
- **Login Issues**: Check Supabase auth logs
- **Email Delivery**: Check Resend delivery logs
- **SMS Issues**: Check Twilio message logs
- **Event Sync**: Check API route logs in Vercel

---

**System Status**: ✅ Ready for Production Launch
**Next Step**: Begin Step 1 - Supabase Project Creation