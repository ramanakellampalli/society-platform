'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment } from '@/lib/financial-api';
import { getFlats } from '@/lib/societies-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Flat, PaymentMode, PaymentStatus } from '@/types';

export default function NewPaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current month/year
  const now = new Date();
  const [flatId, setFlatId] = useState('');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('PAID');
  const [paymentDate, setPaymentDate] = useState(now.toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode | ''>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch flats
  const { data: flats, isLoading: flatsLoading } = useQuery<Flat[]>({
    queryKey: ['flats', user?.societyId],
    queryFn: () => getFlats(user!.societyId),
    enabled: !!user?.societyId,
  });

  // Auto-fill amount based on selected flat
  useEffect(() => {
    if (flatId && flats) {
      const selectedFlat = flats.find(f => f.id === flatId);
      if (selectedFlat) {
        const flatAmount = selectedFlat.maintenanceAmount || selectedFlat.society?.maintenanceAmount;
        if (flatAmount) {
          setAmount(flatAmount.toString());
        }
      }
    }
  }, [flatId, flats]);

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      queryClient.invalidateQueries({ queryKey: ['collection-trends'] });
      router.push('/dashboard/payments');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!flatId) return;

    createPaymentMutation.mutate({
      flatId,
      month,
      year,
      amount: parseFloat(amount),
      status,
      paymentDate: status === 'PAID' ? paymentDate : undefined,
      paymentMode: paymentMode || undefined,
      transactionId: transactionId || undefined,
      notes: notes || undefined,
    });
  };

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

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/payments">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Record Payment</h1>
          <p className="text-gray-500">Record a maintenance payment</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Fill in the details below to record a payment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Flat Selection */}
            <div className="space-y-2">
              <Label htmlFor="flat">Flat *</Label>
              {flatsLoading ? (
                <div className="text-sm text-gray-500">Loading flats...</div>
              ) : (
                <select
                  id="flat"
                  value={flatId}
                  onChange={(e) => setFlatId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a flat</option>
                  {flats?.map((flat) => (
                    <option key={flat.id} value={flat.id}>
                      Flat {flat.flatNumber}
                      {flat.block && ` - Block ${flat.block}`}
                      {flat.ownerName && ` (${flat.ownerName})`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Month and Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status *</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="PARTIAL">Partial</option>
              </select>
            </div>

            {/* Payment Date (only if PAID) */}
            {status === 'PAID' && (
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            )}

            {/* Payment Mode (only if PAID) */}
            {status === 'PAID' && (
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <select
                  id="paymentMode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select payment mode</option>
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>
            )}

            {/* Transaction ID (only if PAID and not CASH) */}
            {status === 'PAID' && paymentMode && paymentMode !== 'CASH' && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID / Reference Number</Label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {createPaymentMutation.isError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {(createPaymentMutation.error as any)?.response?.data?.message || 'Failed to create payment'}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createPaymentMutation.isPending}
                className="flex-1"
              >
                {createPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
              </Button>
              <Button asChild type="button" variant="outline" className="flex-1">
                <Link href="/dashboard/payments">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}