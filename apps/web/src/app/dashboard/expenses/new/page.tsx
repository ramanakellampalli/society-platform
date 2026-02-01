'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createExpense, getExpenseCategories } from '@/lib/financial-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { ExpenseCategory, PaymentMode } from '@/types';

export default function NewExpensePage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Form state
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode | ''>('');
  const [transactionId, setTransactionId] = useState('');

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<ExpenseCategory[]>({
    queryKey: ['expense-categories', user?.societyId],
    queryFn: () => getExpenseCategories(user!.societyId),
    enabled: !!user?.societyId,
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      router.push('/dashboard/expenses');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.societyId || !categoryId) return;

    createExpenseMutation.mutate({
      societyId: user.societyId,
      categoryId,
      date,
      amount: parseFloat(amount),
      vendorName: vendorName || undefined,
      description,
      paymentMode: paymentMode || undefined,
      transactionId: transactionId || undefined,
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/expenses">
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
          <h1 className="text-3xl font-bold">Add New Expense</h1>
          <p className="text-gray-500">Record a new expense for your society</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Fill in the details below to record an expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              {categoriesLoading ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : (
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
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

            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor Name</Label>
              <Input
                id="vendor"
                type="text"
                placeholder="Name of vendor or service provider"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Brief description of the expense"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Payment Mode */}
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

            {/* Transaction ID */}
            {paymentMode && paymentMode !== 'CASH' && (
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

            {/* Error Message */}
            {createExpenseMutation.isError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {(createExpenseMutation.error as any)?.response?.data?.message || 'Failed to create expense'}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createExpenseMutation.isPending}
                className="flex-1"
              >
                {createExpenseMutation.isPending ? 'Creating...' : 'Create Expense'}
              </Button>
              <Button asChild type="button" variant="outline" className="flex-1">
                <Link href="/dashboard/expenses">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}