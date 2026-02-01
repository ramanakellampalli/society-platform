import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { FinancialSummaryDto, MonthlyReportDto, CollectionTrendDto } from './dto/financial-report.dto';
import type { User } from '@repo/database';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getFinancialSummary(societyId: string, startDate: string, endDate: string, user: User): Promise<FinancialSummaryDto> {
    // Verify access
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view reports for your own society');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get total expenses
    const expenses = await this.prisma.expense.findMany({
      where: {
        societyId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        category: true,
      },
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Get expenses by category
    const expensesByCategory = expenses.reduce((acc, exp) => {
      const existing = acc.find(item => item.categoryId === exp.categoryId);
      if (existing) {
        existing.amount += Number(exp.amount);
      } else {
        acc.push({
          categoryId: exp.categoryId,
          categoryName: exp.category.name,
          amount: Number(exp.amount),
          percentage: 0,
          color: exp.category.color || undefined,
        });
      }
      return acc;
    }, [] as any[]);

    // Calculate percentages
    expensesByCategory.forEach(cat => {
      cat.percentage = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
    });

    // Get payments in date range
    const startMonth = start.getMonth() + 1;
    const startYear = start.getFullYear();
    const endMonth = end.getMonth() + 1;
    const endYear = end.getFullYear();

    const payments = await this.prisma.maintenancePayment.findMany({
      where: {
        societyId,
        OR: [
          {
            year: startYear,
            month: { gte: startMonth },
          },
          {
            year: { gt: startYear, lt: endYear },
          },
          {
            year: endYear,
            month: { lte: endMonth },
          },
        ],
      },
    });

    const totalIncome = payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayments = payments
      .filter(p => p.status === 'PENDING' || p.status === 'OVERDUE')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const expectedIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collectionRate = expectedIncome > 0 ? (totalIncome / expectedIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      pendingPayments,
      collectionRate,
      expensesByCategory: expensesByCategory.sort((a, b) => b.amount - a.amount),
    };
  }

  async getMonthlyReport(societyId: string, month: number, year: number, user: User): Promise<MonthlyReportDto> {
    // Verify access
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view reports for your own society');
    }

    // Get society details
    const society = await this.prisma.society.findUnique({
      where: { id: societyId },
      include: {
        flats: true,
      },
    });

    if (!society) {
      throw new ForbiddenException('Society not found');
    }

    // Get all payments for this month
    const payments = await this.prisma.maintenancePayment.findMany({
      where: {
        societyId,
        month,
        year,
      },
    });

    const paidPayments = payments.filter(p => p.status === 'PAID');
    const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE');

    const expectedIncome = society.flats.length * Number(society.maintenanceAmount);
    const collectedIncome = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const pendingIncome = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collectionRate = expectedIncome > 0 ? (collectedIncome / expectedIncome) * 100 : 0;

    // Get expenses for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await this.prisma.expense.findMany({
      where: {
        societyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, exp) => {
      const existing = acc.find(item => item.categoryId === exp.categoryId);
      if (existing) {
        existing.amount += Number(exp.amount);
        existing.count += 1;
      } else {
        acc.push({
          categoryId: exp.categoryId,
          categoryName: exp.category.name,
          amount: Number(exp.amount),
          count: 1,
          color: exp.category.color || undefined,
        });
      }
      return acc;
    }, [] as any[]);

    return {
      month,
      year,
      society: {
        id: society.id,
        name: society.name,
      },
      income: {
        expected: expectedIncome,
        collected: collectedIncome,
        pending: pendingIncome,
        collectionRate,
      },
      expenses: {
        total: totalExpenses,
        byCategory: expensesByCategory.sort((a, b) => b.amount - a.amount),
      },
      balance: collectedIncome - totalExpenses,
      defaulters: {
        count: pendingPayments.length,
        totalAmount: pendingIncome,
      },
    };
  }

  // Get year-to-date summary
  async getYearToDateSummary(societyId: string, year: number, user: User) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return this.getFinancialSummary(societyId, startDate, endDate, user);
  }

  // Get payment collection trends (last 12 months)
  async getCollectionTrends(societyId: string, user: User) {
  if (user.role !== 'ADMIN' && societyId !== user.societyId) {
    throw new ForbiddenException('You can only view reports for your own society');
  }

  const now = new Date();
  const trends: CollectionTrendDto[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const payments = await this.prisma.maintenancePayment.findMany({
      where: {
        societyId,
        month,
        year,
      },
    });

    const expected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collected = payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    trends.push({
      month,
      year,
      monthName: date.toLocaleString('default', { month: 'short' }),
      expected,
      collected,
      collectionRate: expected > 0 ? (collected / expected) * 100 : 0,
    });
  }

  return trends;
}
}