'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  LogOut,
  Building2,
  Menu,
  Building,
  Shield
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  if (!user) {
    router.push('/login');
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', href: "/dashboard/expenses", icon: Receipt },
    { name: 'Payments', href: '/dashboard/payments', icon: DollarSign },
    { name: 'Flats', href: '/dashboard/flats', icon: Building },
    { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
  ];

  // Admin navigation - only for ADMIN users
  const adminNavigation = user.role === 'ADMIN' ? [
    { name: 'Manage Societies', href: '/dashboard/admin/societies', icon: Shield },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 px-3">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Society</span>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Admin Panel Section - Only shows for ADMIN users */}
          {adminNavigation.length > 0 && (
            <>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Admin Panel
                </p>
                <nav className="space-y-2">
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* User Info & Logout - Fixed at bottom */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
              <p className="text-xs text-gray-500 mt-1">
                Role: <span className="font-medium">{user.role}</span>
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Society Management Platform</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}