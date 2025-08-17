import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
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
    const { name } = body

    // Create user profile using Prisma (server-side)
    const profile = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: name || user.user_metadata?.name,
      },
    })

    console.log('✅ Profile created:', profile.id)
    return NextResponse.json(profile)
  } catch (error) {
    console.error('❌ API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
