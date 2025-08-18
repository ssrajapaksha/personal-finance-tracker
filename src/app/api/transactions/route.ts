import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateTransactionAPIRequestSchema } from '@/schemas/transaction';

// GET /api/transactions - Get all transactions for a user
export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Get user ID from query params or headers
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');
    
    const body = await request.json();
    
    // Validate the request data
    const validatedData = CreateTransactionAPIRequestSchema.parse(body);
    
    // Parse the date more carefully
    const parsedDate = new Date(validatedData.date + 'T00:00:00.000Z');
    
    // Convert enum values to match current Prisma client
    const transactionType = validatedData.type.toUpperCase() as 'INCOME' | 'EXPENSE';
    
    console.log('Creating transaction with data:', {
      userId: validatedData.userId,
      amount: validatedData.amount,
      description: validatedData.description,
      category: validatedData.category,
      type: validatedData.type,
      convertedType: transactionType,
      date: validatedData.date,
      parsedDate: parsedDate,
    });
    
    console.log('Type conversion details:', {
      originalType: validatedData.type,
      convertedType: transactionType,
      isIncome: validatedData.type === 'income',
      isExpense: validatedData.type === 'expense',
    });

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: validatedData.userId,
        amount: validatedData.amount,
        description: validatedData.description,
        category: validatedData.category,
        type: transactionType,
        date: parsedDate,
      },
    });

    console.log('Transaction created successfully:', transaction);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid transaction data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
