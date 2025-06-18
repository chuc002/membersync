# MemberSync Deployment Guide

## 🚀 Quick Start

### 1. GitHub Repository Setup

Since we need to create the GitHub repository manually, follow these steps:

#### Option A: Using GitHub Web Interface

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner and select "New repository"
3. **Repository settings**:
   - Repository name: `membersync`
   - Description: `Club management system for Indian Hills Country Club with role-based access control`
   - Visibility: Public (or Private if preferred)
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. **Click "Create repository"**

#### Option B: Using GitHub CLI (if available)

```bash
# Install GitHub CLI first if not available
# Then run:
gh repo create membersync --public --description "Club management system for Indian Hills Country Club with role-based access control"
```

### 2. Connect Local Repository to GitHub

After creating the GitHub repository, connect your local repository:

```bash
# Add the GitHub repository as remote origin
git remote add origin https://github.com/chuc002/membersync.git

# Verify the remote was added
git remote -v

# Push the code to GitHub
git push -u origin main
```

### 3. Update README with Correct GitHub URL

After pushing to GitHub, update the README.md file:

1. Replace `YOUR_USERNAME` with your actual GitHub username in the clone URL
2. Update any other repository-specific URLs

```bash
# Edit README.md to replace YOUR_USERNAME with your actual username
# Then commit and push the update
git add README.md
git commit -m "Update README with correct GitHub repository URL"
git push origin main
```

## 📦 Production Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `membersync` repository

2. **Configure Environment Variables** (optional for demo):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   RESEND_API_KEY=your_resend_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   SYNC_API_KEY=your_secure_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

3. **Deploy**:
   - Vercel will automatically deploy on push to main branch
   - First deployment may take 2-3 minutes

### Alternative Deployment Platforms

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🔧 Development Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/chuc002/membersync.git
cd membersync

# Install dependencies
npm install

# Copy environment variables (optional)
cp .env.example .env.local

# Start development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables Setup

For production features, configure these services:

#### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy API URL and anon key
4. Set up database schema (see `/docs/database-schema.sql`)

#### Resend Setup
1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Verify domain for production emails

#### Twilio Setup
1. Create account at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Purchase phone number for SMS

## 🧪 Testing

### Manual Testing Checklist

#### Member Portal
- [ ] Home page loads correctly
- [ ] Member login works (`sarah.johnson@email.com` / `password`)
- [ ] Dashboard shows events and recommendations
- [ ] Event filtering by category works
- [ ] Family management allows adding/editing members
- [ ] Profile settings can be updated
- [ ] Logout redirects to home page

#### Admin Portal
- [ ] Admin login works (`admin@ihcckc.com` / `admin`)
- [ ] Admin dashboard shows statistics
- [ ] Management buttons are visible
- [ ] Admin cannot access member routes
- [ ] Logout redirects to home page

#### Cross-Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Automated Testing

```bash
# Type checking
npm run type-check

# Build test
npm run build

# Start production server
npm start
```

## 📊 Monitoring

### Production Monitoring

1. **Vercel Analytics**: Automatic with Vercel deployment
2. **Error Monitoring**: Check Vercel function logs
3. **Performance**: Use Lighthouse or WebPageTest
4. **Uptime**: Set up monitoring with UptimeRobot

### Key Metrics to Monitor

- Page load times
- Authentication success rate
- Event registration completions
- Mobile responsiveness
- API response times

## 🔒 Security Checklist

### Pre-Production Security

- [ ] Environment variables secured
- [ ] No secrets in repository
- [ ] HTTPS enforced
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Rate limiting configured

### Post-Deployment Security

- [ ] Security headers configured
- [ ] SSL certificate valid
- [ ] No console errors in production
- [ ] Authentication working correctly
- [ ] Role-based access enforced

## 📈 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build && npx @next/bundle-analyzer

# Check performance
npm run build && npm start
# Use Lighthouse in browser dev tools
```

### Production Performance

- Static generation for public pages
- Image optimization with Next.js
- Code splitting by route
- Caching strategies
- CDN usage (automatic with Vercel)

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Verify all imports are correct
   - Ensure environment variables format

2. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Check network tab for API errors
   - Verify demo credentials

3. **Deployment Issues**
   - Check build logs in Vercel dashboard
   - Verify environment variables are set
   - Ensure all dependencies are in package.json

### Debug Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reset node modules
rm -rf node_modules
npm install

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## 📞 Support

For deployment issues:
1. Check this deployment guide
2. Review Vercel/platform documentation
3. Create issue in GitHub repository
4. Check platform status pages

---

**Last updated**: June 2024
**MemberSync Version**: 1.0.0