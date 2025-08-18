import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateTransactionSchema } from '@/schemas/transaction';

// GET /api/transactions/[id] - Get a specific transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the request data
    const validatedData = UpdateTransactionSchema.parse({
      id,
      ...body,
    });
    
    // Convert enum values to match current Prisma client
    const transactionType = validatedData.type ? validatedData.type.toUpperCase() as 'INCOME' | 'EXPENSE' : undefined;
    
    console.log('Updating transaction with data:', {
      id,
      amount: validatedData.amount,
      description: validatedData.description,
      category: validatedData.category,
      type: validatedData.type,
      convertedType: transactionType,
      date: validatedData.date,
    });
    
    // Update the transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: validatedData.amount,
        description: validatedData.description,
        category: validatedData.category,
        type: transactionType,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to update transaction:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid transaction data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
