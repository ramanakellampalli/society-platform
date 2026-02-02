'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'RESIDENT' as UserRole,
    societyId: '',
    flatId: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    setLoading(true);

    try {
      await register({
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        societyId: formData.societyId,
        flatId: formData.flatId || undefined,
      });
      // Your register function already handles redirect to /dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your details to register for your society
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="RESIDENT">Resident</option>
                <option value="COMMITTEE">Committee Member</option>
                <option value="TREASURER">Treasurer</option>
              </select>
              <p className="text-xs text-gray-500">
                Select your role in the society
              </p>
            </div>

            {/* Society ID */}
            <div className="space-y-2">
              <Label htmlFor="societyId">Society ID *</Label>
              <Input
                id="societyId"
                name="societyId"
                type="text"
                placeholder="Enter your society ID"
                value={formData.societyId}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500">
                Contact your society admin for the Society ID
              </p>
            </div>

            {/* Flat ID (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="flatId">Flat ID (Optional)</Label>
              <Input
                id="flatId"
                name="flatId"
                type="text"
                placeholder="Enter your flat ID"
                value={formData.flatId}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Leave empty if not assigned to a specific flat
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>

          {/* Test Data Helper */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center mb-2">For testing, you need:</p>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono space-y-1">
              <p><strong>Society ID:</strong> Get from Prisma Studio</p>
              <p><strong>Flat ID:</strong> Optional (get from flats list)</p>
              <p className="mt-2 text-gray-600">
                Run: <code>cd packages/database && pnpm db:studio</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}