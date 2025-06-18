import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Test database connection
    const { data: dbTest, error: dbError } = await supabase
      .from('events')
      .select('id')
      .limit(1)

    // Check environment variables
    const envChecks = {
      supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      resend: Boolean(process.env.RESEND_API_KEY),
      auth: Boolean(process.env.NEXTAUTH_SECRET),
    }

    const allSystemsOperational = !dbError && Object.values(envChecks).every(Boolean)

    return NextResponse.json({
      status: allSystemsOperational ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbError ? 'error' : 'operational',
        authentication: envChecks.auth ? 'operational' : 'misconfigured',
        emailService: envChecks.resend ? 'operational' : 'misconfigured',
        smsService: envChecks.twilio ? 'operational' : 'misconfigured',
      },
      environment: process.env.NODE_ENV || 'unknown',
      version: '1.0.0'
    }, {
      status: allSystemsOperational ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      environment: process.env.NODE_ENV || 'unknown'
    }, {
      status: 500
    })
  }
}