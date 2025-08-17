import { prisma } from "@/lib/prisma";
import { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Unable to fetch categories");
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw new Error("Unable to fetch category");
  }
}

export async function createCategory(data: { name: string; color?: string; icon?: string }): Promise<Category> {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        color: data.color || "#3B82F6",
        icon: data.icon,
      },
    });
    return category;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw new Error("Unable to create category");
  }
}

export async function updateCategory(id: string, data: { name?: string; color?: string; icon?: string }): Promise<Category> {
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return category;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw new Error("Unable to update category");
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw new Error("Unable to delete category");
  }
}
