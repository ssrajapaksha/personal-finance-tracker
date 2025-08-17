import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default categories
  const categories = [
    { name: 'Food & Dining', color: '#EF4444', icon: '🍽️' },
    { name: 'Transportation', color: '#3B82F6', icon: '🚗' },
    { name: 'Entertainment', color: '#8B5CF6', icon: '🎬' },
    { name: 'Shopping', color: '#F59E0B', icon: '🛍️' },
    { name: 'Healthcare', color: '#10B981', icon: '🏥' },
    { name: 'Utilities', color: '#6B7280', icon: '💡' },
    { name: 'Housing', color: '#8B5CF6', icon: '🏠' },
    { name: 'Salary', color: '#10B981', icon: '💰' },
    { name: 'Freelance', color: '#F59E0B', icon: '💼' },
    { name: 'Investment', color: '#3B82F6', icon: '📈' },
    { name: 'Other', color: '#6B7280', icon: '📝' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log('✅ Categories seeded successfully')

  // Create a sample user (for development/testing)
  const sampleUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  console.log('✅ Sample user created')

  // Create sample transactions
  const sampleTransactions = [
    {
      userId: sampleUser.id,
      amount: 25.50,
      description: 'Lunch at Subway',
      category: 'Food & Dining',
      type: 'EXPENSE' as const,
      date: new Date(),
    },
    {
      userId: sampleUser.id,
      amount: 45.00,
      description: 'Gas station',
      category: 'Transportation',
      type: 'EXPENSE' as const,
      date: new Date(),
    },
    {
      userId: sampleUser.id,
      amount: 2500.00,
      description: 'Monthly salary',
      category: 'Salary',
      type: 'INCOME' as const,
      date: new Date(),
    },
  ]

  for (const transaction of sampleTransactions) {
    await prisma.transaction.create({
      data: transaction,
    })
  }

  console.log('✅ Sample transactions created')

  // Create sample financial goal
  await prisma.financialGoal.create({
    data: {
      userId: sampleUser.id,
      title: 'Emergency Fund',
      targetAmount: 10000.00,
      currentAmount: 2500.00,
      targetDate: new Date('2024-12-31'),
    },
  })

  console.log('✅ Sample financial goal created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
