'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { getPayments } from '@/lib/financial-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { MaintenancePayment } from '@/types';

export default function PaymentsPage() {
  const { user } = useAuth();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch payments
  const { data: payments, isLoading } = useQuery<MaintenancePayment[]>({
    queryKey: ['payments', user?.societyId, selectedMonth, selectedYear, selectedStatus === 'all' ? undefined : selectedStatus],
    queryFn: () => getPayments(
      user!.societyId, 
      selectedMonth, 
      selectedYear, 
      selectedStatus === 'all' ? undefined : selectedStatus
    ),
    enabled: !!user?.societyId,
  });

  // Calculate statistics
  const totalExpected = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const totalCollected = payments?.filter(p => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const totalPending = payments?.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  const paidCount = payments?.filter(p => p.status === 'PAID').length || 0;
  const pendingCount = payments?.filter(p => p.status === 'PENDING').length || 0;
  const overdueCount = payments?.filter(p => p.status === 'OVERDUE').length || 0;

  // Month options
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

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Payments</h1>
          <p className="text-gray-500">Track monthly maintenance collection</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/payments/new">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Payment
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {/* Month */}
          <div className="flex-1 min-w-[150px]">
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

          {/* Year */}
          <div className="flex-1 min-w-[150px]">
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

          {/* Status */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected</CardTitle>
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
            <div className="text-2xl font-bold">₹{totalExpected.toLocaleString('en-IN')}</div>
            <p className="text-xs text-gray-500">{payments?.length || 0} flats</p>
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
            <div className="text-2xl font-bold text-green-600">₹{totalCollected.toLocaleString('en-IN')}</div>
            <p className="text-xs text-gray-500">{paidCount} flats paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-orange-600"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString('en-IN')}</div>
            <p className="text-xs text-gray-500">{pendingCount + overdueCount} flats pending</p>
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
              className="h-4 w-4 text-blue-600"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <div className="mt-2 bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(collectionRate, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading payments...</div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Status Badge */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        payment.status === 'PAID'
                          ? 'bg-green-500'
                          : payment.status === 'OVERDUE'
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                      }`}
                    />

                    {/* Flat Details */}
                    <div className="flex-1">
                      <div className="font-medium">
                        Flat {payment.flat?.flatNumber}
                        {payment.flat?.block && ` - Block ${payment.flat.block}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.flat?.ownerName || 'No owner name'}
                      </div>
                      {payment.paymentMode && payment.status === 'PAID' && (
                        <div className="text-xs text-gray-400 mt-1">
                          {payment.paymentMode}
                          {payment.transactionId && ` • ${payment.transactionId}`}
                          {payment.paymentDate && (
                            <> • {new Date(payment.paymentDate).toLocaleDateString('en-IN')}</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount and Status */}
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      ₹{Number(payment.amount).toLocaleString('en-IN')}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        payment.status === 'PAID'
                          ? 'text-green-600'
                          : payment.status === 'OVERDUE'
                          ? 'text-red-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {payment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500">No payment records found</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/dashboard/payments/new">Record First Payment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}