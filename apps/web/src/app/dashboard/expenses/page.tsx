'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { getExpenses, getExpenseCategories } from '@/lib/financial-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Expense, ExpenseCategory } from '@/types';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch all expenses
  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ['expenses', user?.societyId],
    queryFn: () => getExpenses(user!.societyId),
    enabled: !!user?.societyId,
  });

  // Fetch categories
  const { data: categories } = useQuery<ExpenseCategory[]>({
    queryKey: ['expense-categories', user?.societyId],
    queryFn: () => getExpenseCategories(user!.societyId),
    enabled: !!user?.societyId,
  });

  // Filter expenses by category
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses?.filter(exp => exp.categoryId === selectedCategory);

  // Calculate totals
  const totalExpenses = filteredExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-gray-500">Track and manage society expenses</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/expenses/new">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Link>
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
          <CardDescription>
            {selectedCategory === 'all' ? 'All categories' : categories?.find(c => c.id === selectedCategory)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{totalExpenses.toLocaleString('en-IN')}</div>
          <p className="text-sm text-gray-500 mt-1">
            {filteredExpenses?.length || 0} expense{filteredExpenses?.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color || '#6B7280' }}
                />
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>All recorded expenses for your society</CardDescription>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="text-center py-8">Loading expenses...</div>
          ) : filteredExpenses && filteredExpenses.length > 0 ? (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: expense.category?.color + '20' || '#6B728020' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: expense.category?.color || '#6B7280' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-gray-500">
                        {expense.category?.name} • {expense.vendorName || 'No vendor'} •{' '}
                        {new Date(expense.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      {expense.paymentMode && (
                        <div className="text-xs text-gray-400 mt-1">
                          Payment: {expense.paymentMode}
                          {expense.transactionId && ` • ${expense.transactionId}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      ₹{Number(expense.amount).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      By {expense.approvedBy?.name}
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
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
              <p className="text-gray-500">No expenses found</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/dashboard/expenses/new">Add Your First Expense</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}