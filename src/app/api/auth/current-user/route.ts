import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
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
    
    console.log('🔍 Auth result:', { user: user?.id, error: error?.message })
    
    if (error || !user) {
      console.log('❌ Authentication failed:', error?.message || 'No user found')
      return NextResponse.json(
        { error: 'Not authenticated', details: error?.message || 'Invalid token' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Get user profile using Prisma (server-side)
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!profile) {
      console.log('❌ User profile not found in database for user:', user.id);
      return NextResponse.json(
        { 
          error: 'User profile not found', 
          details: 'Profile needs to be created',
          userId: user.id,
          email: user.email
        },
        { status: 404 }
      )
    }

    console.log('✅ Profile found:', profile.id)
    return NextResponse.json(profile)
  } catch (error) {
    console.error('❌ API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
