// User & Auth types
export enum UserRole {
  ADMIN = 'ADMIN',
  COMMITTEE = 'COMMITTEE',
  TREASURER = 'TREASURER',
  RESIDENT = 'RESIDENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  societyId: string;
  flatId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  societyId: string;
  flatId?: string;
}

// Society types
export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalFlats: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingPayments: number;
  paidPayments: number;
  overduePayments: number;
}

export interface FinancialSummary {
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

export interface CollectionTrend {
  month: number;
  year: number;
  monthName: string;
  expected: number;
  collected: number;
  collectionRate: number;
}

export interface MonthlyReport {
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

// ... existing types ...

export interface Expense {
  id: string;
  societyId: string;
  categoryId: string;
  date: string;
  amount: number;
  vendorName?: string;
  description: string;
  receiptUrl?: string;
  paymentMode?: PaymentMode;
  transactionId?: string;
  approvedById: string;
  createdAt: string;
  updatedAt: string;
  category?: ExpenseCategory;
  approvedBy?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface ExpenseCategory {
  id: string;
  societyId: string;
  name: string;
  description?: string;
  budgetAmount?: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMode = 'CASH' | 'UPI' | 'CHEQUE' | 'BANK_TRANSFER' | 'ONLINE';

// ... existing types ...

export interface MaintenancePayment {
  id: string;
  flatId: string;
  societyId: string;
  month: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  paymentDate?: string;
  paymentMode?: PaymentMode;
  transactionId?: string;
  recordedById?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  flat?: {
    flatNumber: string;
    block?: string;
    ownerName?: string;
  };
  recordedBy?: {
    name: string;
  };
}

export interface Flat {
  id: string;
  societyId: string;
  flatNumber: string;
  block?: string;
  floor?: number;
  sqFeet?: number;
  maintenanceAmount?: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  isRented: boolean;
  tenantName?: string;
  tenantPhone?: string;
  createdAt: string;
  updatedAt: string;
  society?: {
    id: string;
    name: string;
    maintenanceAmount: number;
  };
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';