'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Society Management Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transparent financial management for residential societies
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/register')}>
              Register
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Financial Transparency</CardTitle>
              <CardDescription>
                Track all income and expenses with detailed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Monthly financial reports</li>
                <li>• Category-wise expense tracking</li>
                <li>• Payment collection trends</li>
                <li>• Real-time balance updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Management</CardTitle>
              <CardDescription>
                Simplified payment tracking and collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Bulk payment generation</li>
                <li>• Payment status tracking</li>
                <li>• Defaulter identification</li>
                <li>• Multiple payment modes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure access control for different user roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Admin dashboard</li>
                <li>• Committee member access</li>
                <li>• Treasurer controls</li>
                <li>• Resident view</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}