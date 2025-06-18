# MemberSync Staff Operations Guide

## Overview
MemberSync is IHCC's member portal for event discovery, registration, and family management. This guide covers daily operations and member support.

---

## 📊 Admin Dashboard Access

### Supabase Database Access
**URL**: `https://[your-project-id].supabase.co`
**Login**: Use admin credentials provided during setup

### Key Tables to Monitor
1. **Members Table**: All registered users
2. **Events Table**: All club events
3. **Registrations Table**: Member event registrations

### Daily Monitoring Tasks
- **Morning Check** (9 AM): Review new member signups overnight
- **Event Updates** (10 AM): Verify today's events are accurate
- **Registration Review** (4 PM): Check registration numbers for upcoming events

---

## 👥 Member Management

### New Member Signups
**Location**: Supabase → Authentication → Users

**Daily Process**:
1. Check new user registrations
2. Verify email addresses are valid
3. Welcome new members via phone call (optional)
4. Ensure member profiles are complete

**Red Flags to Watch**:
- Invalid email formats
- Suspicious phone numbers
- Incomplete family information

### Member Support Issues

#### Password Reset Requests
**Member Says**: "I can't log into MemberSync"
**Solution**:
1. Have them click "Forgot Password" on login page
2. Check their email for reset link
3. If no email received, check spam folder
4. Last resort: Reset password in Supabase admin panel

#### Profile Updates
**Member Says**: "I need to update my information"
**Solution**:
1. Direct them to log in and edit profile
2. For complex changes, update directly in Supabase
3. Family member changes are self-service in Family tab

#### Registration Issues
**Member Says**: "The registration button doesn't work"
**Solution**:
1. Verify the event registration URL in Events table
2. Check if event is still accepting registrations
3. Direct them to call club for manual registration if needed

---

## 📅 Event Management

### Adding New Events
**Location**: Supabase → Table Editor → Events

**Required Fields**:
- **Title**: Event name as it appears on website
- **Description**: Brief, compelling description
- **Date**: YYYY-MM-DD format
- **Time**: HH:MM:SS format (24-hour)
- **Category**: Golf, Dining, Kids, Fitness, or Social
- **Price**: Decimal format (e.g., 45.00)
- **Registration URL**: Full IHCC registration link
- **Club ID**: Always "IHCC"

**Event Categories Guide**:
- **Golf**: Tournaments, lessons, golf-related events
- **Dining**: Restaurant events, wine tastings, special meals
- **Kids**: Children's activities, family events
- **Fitness**: Gym classes, sports activities, wellness
- **Social**: Mixers, parties, general social gatherings

### Updating Existing Events
1. Find event in Events table
2. Edit required fields
3. Click Save
4. Changes appear immediately on member dashboards

### Event Registration Monitoring
**Weekly Report**: Check which events have low registration
**Action Items**:
- Events with <10 registrations: Consider additional promotion
- Events with >50 registrations: Verify capacity limits
- Sold out events: Add to waitlist if possible

---

## 📱 Notification Management

### Email Notifications
**Service**: Resend Dashboard
**Login**: Access provided during setup

**Types of Emails Sent**:
1. **Welcome Emails**: New member registration
2. **Event Notifications**: New events matching preferences
3. **Registration Confirmations**: Event sign-up confirmations
4. **Event Reminders**: Day-before reminders

**Monitoring**:
- Check delivery rates weekly
- Watch for bounce/spam reports
- Update email templates seasonally

### SMS Notifications
**Service**: Twilio Console
**Login**: Access provided during setup

**Types of SMS Sent**:
1. **Event Recommendations**: New events for interested members
2. **Event Reminders**: Day-of-event notifications
3. **Important Announcements**: Club-wide communications

**Best Practices**:
- SMS sent only to members who opted in
- Keep messages under 160 characters
- Include "Reply STOP to opt out"
- Monitor delivery rates and costs

---

## 🔧 Technical Support

### Common Technical Issues

#### "Website is Slow"
**Causes**: High traffic, large images, server issues
**Solutions**:
1. Check Vercel status page
2. Verify recent deployment status
3. Contact technical support if widespread

#### "I'm Not Getting Notifications"
**Email Issues**:
1. Check spam folder
2. Verify email address in member profile
3. Check Resend delivery logs

**SMS Issues**:
1. Verify phone number format in profile
2. Check if member opted in to SMS
3. Review Twilio message logs

#### "Events Aren't Showing"
**Troubleshooting**:
1. Check if events exist in Supabase Events table
2. Verify event dates are in the future
3. Check category filters on dashboard
4. Force refresh browser cache

### Escalation Procedures
**Level 1**: Front desk staff handle basic questions
**Level 2**: IT staff handle technical issues
**Level 3**: Development team for system bugs

**Contact Information**:
- Technical Support: [Your IT contact]
- Development Team: [Your development contact]
- Emergency Contact: [24/7 support if available]

---

## 📈 Analytics and Reporting

### Monthly Reports to Generate
1. **Member Growth**: New signups vs. churned members
2. **Event Popularity**: Most/least popular event categories
3. **Engagement Metrics**: Login frequency, event registrations
4. **Family Usage**: Family member additions and activity

### Key Performance Indicators (KPIs)
- **Member Adoption**: % of club members using MemberSync
- **Event Registration Rate**: Online vs. phone registrations
- **Notification Engagement**: Email open rates, SMS response rates
- **Family Feature Usage**: % of members with family profiles

### Data Access
**Supabase Analytics**: Basic usage statistics
**Vercel Analytics**: Website performance and traffic
**Email Analytics**: Open rates, click rates in Resend
**SMS Analytics**: Delivery rates, opt-out rates in Twilio

---

## 🚨 Emergency Procedures

### System Outage
1. **Check Status**: Verify Vercel deployment status
2. **Member Communication**: Post update on club website/social media
3. **Fallback Process**: Revert to phone/email registration temporarily
4. **Escalation**: Contact development team immediately

### Data Security Incident
1. **Immediate Action**: Change all admin passwords
2. **Assessment**: Determine scope of potential breach
3. **Member Notification**: Required if personal data compromised
4. **Recovery**: Restore from backups if necessary

### High Volume Events
**Preparation for Popular Events**:
1. Monitor server capacity before announcement
2. Prepare for increased support calls
3. Have backup registration process ready
4. Communicate any capacity limits clearly

---

## 📞 Member Communication Scripts

### Welcome Call Script
"Hi [Name], this is [Your Name] from Indian Hills Country Club. I noticed you just signed up for MemberSync, our new member portal. I wanted to personally welcome you and see if you have any questions about using the system..."

### Technical Support Script
"I understand you're having trouble with MemberSync. Let me help you with that. First, let's make sure you're using the correct website address: membersync.vercel.app. Are you able to see the login page?"

### Event Registration Script
"I see you're interested in [Event Name]. You can register online through MemberSync, or I'd be happy to register you over the phone right now. Which would you prefer?"

---

## 🔄 Weekly Maintenance Checklist

### Monday Morning (15 minutes)
- [ ] Review weekend member signups
- [ ] Check for any system error reports
- [ ] Verify this week's events are displaying correctly

### Wednesday Afternoon (20 minutes)
- [ ] Review event registration numbers
- [ ] Check notification delivery reports
- [ ] Update any event details if needed

### Friday End-of-Week (25 minutes)
- [ ] Generate weekly activity report
- [ ] Plan next week's event promotions
- [ ] Review member feedback/support tickets

---

## 📚 Training Resources

### New Staff Training (2 hours)
1. **Hour 1**: System overview and navigation
2. **Hour 2**: Hands-on member support scenarios

### Quarterly Training Updates (1 hour)
- New feature announcements
- Updated procedures
- Best practices sharing

### Resources
- **Video Tutorials**: [Link to training videos]
- **FAQ Document**: [Link to FAQ]
- **Contact Support**: [Support contact information]

---

**Document Version**: 1.0
**Last Updated**: December 2024
**Next Review**: March 2025