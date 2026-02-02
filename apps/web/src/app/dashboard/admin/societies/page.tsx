'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSociety, getSocieties } from '@/lib/societies-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Copy, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function AdminSocietiesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    totalFlats: '',
    maintenanceAmount: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // Society ID to delete

  // Only ADMIN can access
  if (user?.role !== 'ADMIN') {
    return <div className="p-8 text-red-600">Access Denied: Admin Only</div>;
  }

  const { data: societies } = useQuery({
    queryKey: ['all-societies'],
    queryFn: getSocieties,
  });

  const createMutation = useMutation({
    mutationFn: createSociety,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-societies'] });
      setShowForm(false);
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        totalFlats: '',
        maintenanceAmount: '',
      });
      alert('Society created! Share the Society ID with the committee.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (societyId: string) => {
      await apiClient.delete(`/societies/${societyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-societies'] });
      setDeleteConfirm(null);
      alert('Society deleted successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete society');
      setDeleteConfirm(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      totalFlats: parseInt(formData.totalFlats),
      maintenanceAmount: parseFloat(formData.maintenanceAmount),
      billingCycle: 'MONTHLY',
    });
  };

  const handleDelete = (societyId: string) => {
    deleteMutation.mutate(societyId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Society ID copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Admin - Societies</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Society'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Society</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Society Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pincode *</Label>
                  <Input
                    value={formData.pincode}
                    maxLength={6}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total Flats *</Label>
                  <Input
                    type="number"
                    value={formData.totalFlats}
                    onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Monthly Maintenance (₹) *</Label>
                <Input
                  type="number"
                  value={formData.maintenanceAmount}
                  onChange={(e) => setFormData({ ...formData, maintenanceAmount: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Society'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Societies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {societies?.map((society: any) => (
              <div key={society.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{society.name}</h3>
                    <p className="text-sm text-gray-600">
                      {society.city}, {society.state} - {society.pincode}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {society.totalFlats} flats • ₹{society.maintenanceAmount.toLocaleString('en-IN')}/month
                    </p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteConfirm(society.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Society ID */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Society ID (share with committee):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-white p-2 rounded border">
                      {society.id}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(society.id)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-red-600">Delete Society?</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteConfirm(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this society? This action cannot be undone.
              </p>
              <p className="text-sm text-gray-500">
                This will also delete all associated flats, expenses, payments, and users.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteMutation.isPending}
                >
                  No, Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}