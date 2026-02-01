import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import type { User } from '@repo/database';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) { }

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    // Only COMMITTEE or TREASURER can create expenses
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only committee members can create expenses');
    }

    // Verify society exists and user has access
    const society = await this.prisma.society.findUnique({
      where: { id: createExpenseDto.societyId },
    });

    if (!society) {
      throw new BadRequestException('Society not found');
    }

    if (user.role !== 'ADMIN' && society.id !== user.societyId) {
      throw new ForbiddenException('You can only create expenses for your own society');
    }

    // Verify category exists and belongs to society
    const category = await this.prisma.expenseCategory.findFirst({
      where: {
        id: createExpenseDto.categoryId,
        societyId: createExpenseDto.societyId,
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found or does not belong to this society');
    }

    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        date: new Date(createExpenseDto.date),  // Convert string to Date
        approvedById: user.id,
      },
      include: {
        category: true,
        approvedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(societyId: string, user: User, startDate?: string, endDate?: string) {
    // Verify access to society
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view expenses for your own society');
    }

    const where: any = { societyId };

    // Add date filters if provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.expense.findMany({
      where,
      include: {
        category: true,
        approvedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, user: User) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        society: true,
        approvedBy: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Verify access
    if (user.role !== 'ADMIN' && expense.societyId !== user.societyId) {
      throw new ForbiddenException('You can only view expenses for your own society');
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: User) {
    // Only COMMITTEE or TREASURER can update expenses
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only committee members can update expenses');
    }

    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Verify access
    if (user.role !== 'ADMIN' && expense.societyId !== user.societyId) {
      throw new ForbiddenException('You can only update expenses for your own society');
    }

    return this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
      include: {
        category: true,
        approvedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string, user: User) {
    // Only COMMITTEE or TREASURER can delete expenses
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only committee members can delete expenses');
    }

    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Verify access
    if (user.role !== 'ADMIN' && expense.societyId !== user.societyId) {
      throw new ForbiddenException('You can only delete expenses for your own society');
    }

    return this.prisma.expense.delete({
      where: { id },
    });
  }

  // Get expenses by category
  async getByCategory(societyId: string, categoryId: string, user: User) {
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view expenses for your own society');
    }

    return this.prisma.expense.findMany({
      where: {
        societyId,
        categoryId,
      },
      include: {
        category: true,
        approvedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  // Create or get default expense categories for a society
  async ensureDefaultCategories(societyId: string) {
    const defaultCategories = [
      { name: 'Security', description: 'Security guard salaries and expenses', color: '#EF4444', budgetAmount: 50000 },
      { name: 'Cleaning', description: 'Cleaning staff and supplies', color: '#10B981', budgetAmount: 30000 },
      { name: 'Electricity', description: 'Common area electricity bills', color: '#F59E0B', budgetAmount: 40000 },
      { name: 'Water', description: 'Water supply and maintenance', color: '#3B82F6', budgetAmount: 20000 },
      { name: 'Repairs', description: 'Maintenance and repair work', color: '#8B5CF6', budgetAmount: 50000 },
      { name: 'Salaries', description: 'Staff salaries', color: '#EC4899', budgetAmount: 80000 },
      { name: 'Gardening', description: 'Garden maintenance', color: '#14B8A6', budgetAmount: 15000 },
      { name: 'Other', description: 'Miscellaneous expenses', color: '#6B7280', budgetAmount: 20000 },
    ];

    const existingCategories = await this.prisma.expenseCategory.findMany({
      where: { societyId },
    });

    if (existingCategories.length === 0) {
      await this.prisma.expenseCategory.createMany({
        data: defaultCategories.map(cat => ({
          ...cat,
          societyId,
        })),
      });
    }

    return this.prisma.expenseCategory.findMany({
      where: { societyId },
      orderBy: { name: 'asc' },
    });
  }
}