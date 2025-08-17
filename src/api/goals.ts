import { prisma } from "@/lib/prisma";
import { FinancialGoal, GoalStatus } from "@/types";

export interface CreateGoalData {
  userId: string;
  title: string;
  targetAmount: number;
  targetDate?: Date;
}

export interface UpdateGoalData {
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
  status?: GoalStatus;
}

export async function getGoals(userId: string): Promise<FinancialGoal[]> {
  try {
    const goals = await prisma.financialGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return goals;
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    throw new Error("Unable to fetch goals");
  }
}

export async function getGoal(id: string): Promise<FinancialGoal | null> {
  try {
    const goal = await prisma.financialGoal.findUnique({
      where: { id },
    });
    return goal;
  } catch (error) {
    console.error("Failed to fetch goal:", error);
    throw new Error("Unable to fetch goal");
  }
}

export async function createGoal(data: CreateGoalData): Promise<FinancialGoal> {
  try {
    const goal = await prisma.financialGoal.create({
      data: {
        userId: data.userId,
        title: data.title,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate,
      },
    });
    return goal;
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw new Error("Unable to create goal");
  }
}

export async function updateGoal(id: string, data: UpdateGoalData): Promise<FinancialGoal> {
  try {
    const goal = await prisma.financialGoal.update({
      where: { id },
      data,
    });
    return goal;
  } catch (error) {
    console.error("Failed to update goal:", error);
    throw new Error("Unable to update goal");
  }
}

export async function deleteGoal(id: string): Promise<void> {
  try {
    await prisma.financialGoal.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete goal:", error);
    throw new Error("Unable to delete goal");
  }
}

export async function updateGoalProgress(id: string, currentAmount: number): Promise<FinancialGoal> {
  try {
    const goal = await prisma.financialGoal.update({
      where: { id },
      data: { currentAmount },
    });
    return goal;
  } catch (error) {
    console.error("Failed to update goal progress:", error);
    throw new Error("Unable to update goal progress");
  }
}

export async function getActiveGoals(userId: string): Promise<FinancialGoal[]> {
  try {
    const goals = await prisma.financialGoal.findMany({
      where: { 
        userId,
        status: 'ACTIVE'
      },
      orderBy: { targetDate: 'asc' },
    });
    return goals;
  } catch (error) {
    console.error("Failed to fetch active goals:", error);
    throw new Error("Unable to fetch active goals");
  }
}
