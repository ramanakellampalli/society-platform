'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFlat } from '@/lib/societies-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function NewFlatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    flatNumber: '',
    block: '',
    floor: '',
    sqFeet: '',
    maintenanceAmount: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    isRented: false,
    tenantName: '',
    tenantPhone: '',
  });

  // Create flat mutation
  const createFlatMutation = useMutation({
    mutationFn: createFlat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      router.push('/dashboard/flats');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.societyId) return;

    createFlatMutation.mutate({
      societyId: user.societyId,
      flatNumber: formData.flatNumber,
      block: formData.block || undefined,
      floor: formData.floor ? parseInt(formData.floor) : undefined,
      sqFeet: formData.sqFeet ? parseInt(formData.sqFeet) : undefined,
      maintenanceAmount: formData.maintenanceAmount ? parseFloat(formData.maintenanceAmount) : undefined,
      ownerName: formData.ownerName || undefined,
      ownerPhone: formData.ownerPhone || undefined,
      ownerEmail: formData.ownerEmail || undefined,
      isRented: formData.isRented,
      tenantName: formData.tenantName || undefined,
      tenantPhone: formData.tenantPhone || undefined,
    });
  };

  if (!user || !['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">You don't have permission to add flats</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/flats">
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
          <h1 className="text-3xl font-bold">Add New Flat</h1>
          <p className="text-gray-500">Add a flat to your society</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Flat Details</CardTitle>
          <CardDescription>Fill in the details below to add a new flat</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Flat Number */}
            <div className="space-y-2">
              <Label htmlFor="flatNumber">Flat Number *</Label>
              <Input
                id="flatNumber"
                name="flatNumber"
                type="text"
                placeholder="e.g., 101, A-201"
                value={formData.flatNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Block and Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Input
                  id="block"
                  name="block"
                  type="text"
                  placeholder="e.g., A, B"
                  value={formData.block}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  placeholder="e.g., 1, 2"
                  value={formData.floor}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Area and Maintenance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sqFeet">Area (sq ft)</Label>
                <Input
                  id="sqFeet"
                  name="sqFeet"
                  type="number"
                  placeholder="e.g., 1200"
                  value={formData.sqFeet}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceAmount">Maintenance (₹)</Label>
                <Input
                  id="maintenanceAmount"
                  name="maintenanceAmount"
                  type="number"
                  step="0.01"
                  placeholder="Override society default"
                  value={formData.maintenanceAmount}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Owner Details */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Owner Details</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    placeholder="Full name of the owner"
                    value={formData.ownerName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Owner Phone</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Owner Email</Label>
                    <Input
                      id="ownerEmail"
                      name="ownerEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Details */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="isRented"
                  name="isRented"
                  checked={formData.isRented}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="isRented" className="cursor-pointer">
                  This flat is rented
                </Label>
              </div>

              {formData.isRented && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenantName">Tenant Name</Label>
                    <Input
                      id="tenantName"
                      name="tenantName"
                      type="text"
                      placeholder="Full name of the tenant"
                      value={formData.tenantName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenantPhone">Tenant Phone</Label>
                    <Input
                      id="tenantPhone"
                      name="tenantPhone"
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={formData.tenantPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {createFlatMutation.isError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {(createFlatMutation.error as any)?.response?.data?.message || 'Failed to create flat'}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createFlatMutation.isPending}
                className="flex-1"
              >
                {createFlatMutation.isPending ? 'Creating...' : 'Create Flat'}
              </Button>
              <Button asChild type="button" variant="outline" className="flex-1">
                <Link href="/dashboard/flats">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}