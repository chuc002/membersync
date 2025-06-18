import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock health check for demo - all systems operational
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mode: 'demo',
      services: {
        database: 'operational (mock)',
        authentication: 'operational (mock)',
        emailService: 'operational (mock)',
        smsService: 'operational (mock)',
      },
      environment: process.env.NODE_ENV || 'unknown',
      version: '1.0.0'
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