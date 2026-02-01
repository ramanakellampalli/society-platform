export class FinancialSummaryDto {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingPayments: number;
  collectionRate: number;
  expensesByCategory: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    color?: string;
  }[];
}

export class MonthlyReportDto {
  month: number;
  year: number;
  society: {
    id: string;
    name: string;
  };
  income: {
    expected: number;
    collected: number;
    pending: number;
    collectionRate: number;
  };
  expenses: {
    total: number;
    byCategory: {
      categoryId: string;
      categoryName: string;
      amount: number;
      count: number;
      color?: string;
    }[];
  };
  balance: number;
  defaulters: {
    count: number;
    totalAmount: number;
  };
}

export class CollectionTrendDto {
  month: number;
  year: number;
  monthName: string;
  expected: number;
  collected: number;
  collectionRate: number;
}