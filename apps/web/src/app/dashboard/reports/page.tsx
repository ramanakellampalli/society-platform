'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyReport } from '@/lib/financial-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MonthlyReport } from '@/types';

export default function ReportsPage() {
  const { user } = useAuth();
  const currentDate = new Date();
  
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Fetch monthly report
  const { data: report, isLoading } = useQuery<MonthlyReport>({
    queryKey: ['monthly-report', user?.societyId, selectedMonth, selectedYear],
    queryFn: () => getMonthlyReport(user!.societyId, selectedMonth, selectedYear),
    enabled: !!user?.societyId,
  });

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-gray-500">Monthly financial statements and analysis</p>
        </div>
        <Button onClick={handlePrint} variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Report
        </Button>
      </div>

      {/* Month/Year Selector */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Select Period</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading report...</div>
      ) : report ? (
        <>
          {/* Print Header (only visible when printing) */}
          <div className="hidden print:block mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold">{report.society.name}</h1>
            <p className="text-gray-600">
              Monthly Financial Report - {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Generated on {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expected Income</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-gray-500"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{report.income.expected.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-500">Total maintenance due</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collected</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-green-600"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{report.income.collected.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-500">
                  {report.income.collectionRate.toFixed(1)}% collection rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-red-600"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ₹{report.expenses.total.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-500">
                  {report.expenses.byCategory.length} categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className={`h-4 w-4 ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{report.balance.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-500">
                  {report.balance >= 0 ? 'Surplus' : 'Deficit'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Income vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Financial overview for the selected month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Expected Income Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Expected Income</span>
                    <span className="text-gray-500">₹{report.income.expected.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-blue-500 h-8 flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{ width: '100%' }}
                    >
                      100%
                    </div>
                  </div>
                </div>

                {/* Collected Income Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Collected Income</span>
                    <span className="text-green-600">₹{report.income.collected.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-green-500 h-8 flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{
                        width: `${(report.income.collected / report.income.expected) * 100}%`,
                        minWidth: '60px',
                      }}
                    >
                      {report.income.collectionRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Total Expenses Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Total Expenses</span>
                    <span className="text-red-600">₹{report.expenses.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-red-500 h-8 flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{
                        width: `${Math.min((report.expenses.total / report.income.expected) * 100, 100)}%`,
                        minWidth: '60px',
                      }}
                    >
                      {((report.expenses.total / report.income.expected) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown by Category */}
          {report.expenses.byCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown by Category</CardTitle>
                <CardDescription>Detailed category-wise expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.expenses.byCategory.map((category) => (
                    <div key={category.categoryId}>
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || '#6B7280' }}
                          />
                          <span className="font-medium">{category.categoryName}</span>
                          <span className="text-gray-500">({category.count} expenses)</span>
                        </div>
                        <span className="text-gray-700">₹{category.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${(category.amount / report.expenses.total) * 100}%`,
                            backgroundColor: category.color || '#6B7280',
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((category.amount / report.expenses.total) * 100).toFixed(1)}% of total expenses
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Collection Status</CardTitle>
              <CardDescription>Outstanding payments summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {report.defaulters.count}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pending Payments</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    ₹{report.defaulters.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Outstanding Amount</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{report.income.collected.toLocaleString('en-IN')}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Collected Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Print Footer */}
          <div className="hidden print:block mt-8 pt-4 border-t text-sm text-gray-500">
            <p>This is a system-generated report. For queries, contact the society committee.</p>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500">No data available for this period</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}