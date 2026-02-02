'use client';

import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { getFlats } from '@/lib/societies-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Flat } from '@/types';

export default function FlatsPage() {
  const { user } = useAuth();

  // Fetch flats
  const { data: flats, isLoading } = useQuery<Flat[]>({
    queryKey: ['flats', user?.societyId],
    queryFn: () => getFlats(user!.societyId),
    enabled: !!user?.societyId,
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Flats</h1>
          <p className="text-gray-500">Manage flats in your society</p>
        </div>
        {['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role) && (
          <Button asChild>
            <Link href="/dashboard/flats/new">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Flat
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Total Flats</p>
              <p className="text-2xl font-bold">{flats?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupied</p>
              <p className="text-2xl font-bold">
                {flats?.filter(f => f.ownerName).length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rented</p>
              <p className="text-2xl font-bold">
                {flats?.filter(f => f.isRented).length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flats List */}
      <Card>
        <CardHeader>
          <CardTitle>All Flats</CardTitle>
          <CardDescription>List of all flats in your society</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading flats...</div>
          ) : flats && flats.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flats.map((flat) => (
                <div
                  key={flat.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Flat {flat.flatNumber}
                      </h3>
                      {flat.block && (
                        <p className="text-sm text-gray-500">Block {flat.block}</p>
                      )}
                    </div>
                    {flat.isRented && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        Rented
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {flat.ownerName && (
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-gray-700">{flat.ownerName}</span>
                      </div>
                    )}

                    {flat.ownerPhone && (
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-gray-600">{flat.ownerPhone}</span>
                      </div>
                    )}

                    {flat.isRented && flat.tenantName && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">Tenant:</p>
                        <p className="text-gray-700">{flat.tenantName}</p>
                        {flat.tenantPhone && (
                          <p className="text-gray-600 text-xs">{flat.tenantPhone}</p>
                        )}
                      </div>
                    )}

                    {flat.sqFeet && (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                        <span>{flat.sqFeet} sq ft</span>
                      </div>
                    )}

                    {flat.maintenanceAmount && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">Maintenance</p>
                        <p className="text-lg font-semibold text-gray-700">
                          ₹{flat.maintenanceAmount.toLocaleString('en-IN')}/month
                        </p>
                      </div>
                    )}
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-gray-500">No flats found</p>
              {['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role) && (
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/dashboard/flats/new">Add Your First Flat</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}