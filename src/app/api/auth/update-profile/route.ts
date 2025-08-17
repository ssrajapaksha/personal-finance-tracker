import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header or invalid format')
      return NextResponse.json(
        { error: 'Not authenticated', details: 'No authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔍 Token received:', token.substring(0, 20) + '...')

    // Create Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      console.log('❌ Authentication failed:', error?.message || 'No user found')
      return NextResponse.json(
        { error: 'Not authenticated', details: error?.message || 'Invalid token' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.id)

    const body = await request.json()
    const { name, email } = body

    // Update user profile using Prisma (server-side)
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    })

    console.log('✅ Profile updated:', updatedProfile.id)
    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('❌ API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
