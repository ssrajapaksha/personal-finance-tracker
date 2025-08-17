import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });

    console.log('🔍 Database users:', users);

    return NextResponse.json({
      message: 'Database users retrieved',
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('❌ Debug API error:', error);
    return NextResponse.json(
      { error: 'Failed to get users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
