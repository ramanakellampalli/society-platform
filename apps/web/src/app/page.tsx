'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-muted border-t-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Preparing your workspace…
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="inline-block mb-4 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Society Finance & Operations
          </span>

          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            Society Management Platform
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            A modern, transparent system to manage finances, maintenance,
            and access control for residential societies.
          </p>

          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => router.push('/login')}>
              Sign in
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/register')}
            >
              Create account
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">
                Financial Transparency
              </CardTitle>
              <CardDescription>
                Complete visibility into society finances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Monthly & annual reports</li>
                <li>• Category-wise expense tracking</li>
                <li>• Collection and payment trends</li>
                <li>• Real-time balance visibility</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">
                Maintenance Management
              </CardTitle>
              <CardDescription>
                Streamlined billing and collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Bulk maintenance generation</li>
                <li>• Payment status tracking</li>
                <li>• Defaulter identification</li>
                <li>• Multiple payment modes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Secure and structured access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Admin & committee dashboards</li>
                <li>• Treasurer-level controls</li>
                <li>• Resident-only views</li>
                <li>• Permission-based actions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
