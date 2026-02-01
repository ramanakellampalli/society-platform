'use client';

import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { getFinancialSummary, getCollectionTrends } from '@/lib/financial-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { FinancialSummary, CollectionTrend } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();

  // Get current year
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  // Fetch financial summary
  const { data: summary, isLoading: summaryLoading } = useQuery<FinancialSummary>({
    queryKey: ['financial-summary', user?.societyId, startDate, endDate],
    queryFn: () => getFinancialSummary(user!.societyId, startDate, endDate),
    enabled: !!user?.societyId,
  });

  // Fetch collection trends
  const { data: trends, isLoading: trendsLoading } = useQuery<CollectionTrend[]>({
    queryKey: ['collection-trends', user?.societyId],
    queryFn: () => getCollectionTrends(user!.societyId),
    enabled: !!user?.societyId,
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
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
            <div className="text-2xl font-bold">
              {summaryLoading ? '...' : `₹${summary?.totalIncome.toLocaleString('en-IN') || 0}`}
            </div>
            <p className="text-xs text-gray-500">Year to date</p>
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
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? '...' : `₹${summary?.totalExpenses.toLocaleString('en-IN') || 0}`}
            </div>
            <p className="text-xs text-gray-500">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-blue-600"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summaryLoading ? '...' : `₹${summary?.balance.toLocaleString('en-IN') || 0}`}
            </div>
            <p className="text-xs text-gray-500">Current balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-yellow-600"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? '...' : `${summary?.collectionRate.toFixed(1) || 0}%`}
            </div>
            <p className="text-xs text-gray-500">Payment collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Trends (Last 12 Months)</CardTitle>
          <CardDescription>Monthly collection rate overview</CardDescription>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="text-center py-8">Loading trends...</div>
          ) : trends && trends.length > 0 ? (
            <div className="space-y-2">
              {trends.slice(-6).map((trend) => (
                <div key={`${trend.year}-${trend.month}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-sm font-medium w-16">
                      {trend.monthName} {trend.year}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(trend.collectionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium ml-4 w-12 text-right">
                    {trend.collectionRate.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      {summary && summary.expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown by Category</CardTitle>
            <CardDescription>Year to date spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.expensesByCategory.slice(0, 5).map((category) => (
                <div key={category.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || '#6B7280' }}
                    />
                    <span className="text-sm font-medium">{category.categoryName}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-xs">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color || '#6B7280',
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium">₹{category.amount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button asChild variant="outline" className="h-24 flex-col">
            <Link href="/dashboard/expenses">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-24 flex-col">
            <Link href="/dashboard/payments">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Record Payment
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-24 flex-col">
            <Link href="/dashboard/reports">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2"
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
              View Reports
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}