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
('Golf Tournament - Member Guest', 'Annual member-guest golf tournament with prizes and dinner', '2024-01-15', '08:00:00', 'Golf', 125.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844355', 'IHCC'),
('Wine Tasting Dinner', 'Five-course dinner paired with premium wines', '2024-01-20', '18:30:00', 'Dining', 89.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844356', 'IHCC'),
('Kids Swimming Lessons', 'Learn to swim program for children ages 5-12', '2024-01-22', '16:00:00', 'Kids', 45.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844357', 'IHCC'),
('Fitness Boot Camp', 'High-intensity interval training session', '2024-01-25', '06:00:00', 'Fitness', 25.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844358', 'IHCC'),
('New Year Social Mixer', 'Welcome the new year with fellow members', '2024-01-28', '19:00:00', 'Social', 35.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844359', 'IHCC'),
('Ladies Golf Clinic', 'Improve your golf game with professional instruction', '2024-02-01', '10:00:00', 'Golf', 65.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844360', 'IHCC'),
('Valentine\'s Day Dinner', 'Romantic dinner for couples', '2024-02-14', '18:00:00', 'Dining', 95.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844361', 'IHCC'),
('Kids Art Workshop', 'Creative art activities for children', '2024-02-17', '14:00:00', 'Kids', 20.00, 'https://www.ihcckc.com/default.aspx?p=.NETEventView&ID=3844362', 'IHCC');