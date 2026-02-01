import { apiClient } from './api-client';
export const getFinancialSummary = async (
  societyId: string,
  startDate: string,
  endDate: string
) => {
  const response = await apiClient.get(
    `/financial/reports/society/${societyId}/summary`,
    {
      params: { startDate, endDate },
    }
  );
  return response.data;
};

export const getCollectionTrends = async (societyId: string) => {
  const response = await apiClient.get(
    `/financial/reports/society/${societyId}/trends`
  );
  return response.data;
};

export const getMonthlyReport = async (
  societyId: string,
  month: number,
  year: number
) => {
  const response = await apiClient.get(
    `/financial/reports/society/${societyId}/monthly`,
    {
      params: { month, year },
    }
  );
  return response.data;
};

// ... existing code ...

export const getExpenses = async (societyId: string, startDate?: string, endDate?: string) => {
  const response = await apiClient.get(`/financial/expenses/society/${societyId}`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getExpenseCategories = async (societyId: string) => {
  const response = await apiClient.get(`/financial/expenses/society/${societyId}/categories`);
  return response.data;
};

export const createExpense = async (data: {
  societyId: string;
  categoryId: string;
  date: string;
  amount: number;
  vendorName?: string;
  description: string;
  paymentMode?: string;
  transactionId?: string;
}) => {
  const response = await apiClient.post('/financial/expenses', data);
  return response.data;
};

// ... existing code ...

export const getPayments = async (
  societyId: string,
  month?: number,
  year?: number,
  status?: string
) => {
  const response = await apiClient.get(`/financial/payments/society/${societyId}`, {
    params: { month, year, status },
  });
  return response.data;
};

export const createPayment = async (data: {
  flatId: string;
  month: number;
  year: number;
  amount: number;
  status?: string;
  paymentDate?: string;
  paymentMode?: string;
  transactionId?: string;
  notes?: string;
}) => {
  const response = await apiClient.post('/financial/payments', data);
  return response.data;
};