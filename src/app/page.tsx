'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const { user, member, loading, isAdmin, isMember } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (isAdmin) {
        router.push('/admin')
      } else if (isMember) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, isAdmin, isMember, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is logged in, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MemberSync</h1>
              <p className="text-gray-600">Indian Hills Country Club</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your Club Experience
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover exclusive events, connect with fellow members, and enjoy all that 
            Indian Hills Country Club has to offer. Join our community today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Become a Member
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Member Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">⛳</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Championship Golf</h3>
            <p className="text-gray-600">
              Play on our pristine 18-hole championship golf course with professional instruction available.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Fine Dining</h3>
            <p className="text-gray-600">
              Experience exceptional cuisine at our award-winning restaurant and exclusive member dining events.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Family Activities</h3>
            <p className="text-gray-600">
              Enjoy swimming, tennis, fitness programs, and special events designed for the whole family.
            </p>
          </div>
        </div>

        {/* Demo Login Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Demo Login Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Member Access</h4>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Email:</p>
                <p className="font-mono text-blue-600">sarah.johnson@email.com</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">Password:</p>
                <p className="font-mono text-blue-600">password</p>
              </div>
              <p className="text-sm text-gray-500">View events, manage family, register for activities</p>
            </div>
            
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Staff Access</h4>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Email:</p>
                <p className="font-mono text-blue-600">admin@ihcckc.com</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">Password:</p>
                <p className="font-mono text-blue-600">admin</p>
              </div>
              <p className="text-sm text-gray-500">Manage members, create events, view reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Indian Hills Country Club. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This is a demo application showcasing club member management features.
          </p>
        </div>
      </footer>
    </div>
  )
}