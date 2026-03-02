'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

interface FinancialStats {
  totalRevenueThisMonth: number;
  totalOutstandingDues: number;
  recentPaymentActivity: number;
  totalStudentsWithDues: number;
  averageMonthlyRevenue: number;
  collectionEfficiency: number;
  totalFeeAllocations: number;
  paidAllocations: number;
  pendingAllocations: number;
  overdueAllocations: number;
  totalFamilies: number;
  familiesWithOutstanding: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export default function FinancialsHubPage() {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFinancialStats();
  }, []);

  const fetchFinancialStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/financials/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch financial statistics');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'record-payment',
      title: 'Record Payment',
      description: 'Record a new payment from a family',
      icon: '💰',
      href: '/admin/payments?action=add',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'generate-bills',
      title: 'Generate Bills',
      description: 'Create monthly fee allocations',
      icon: '📄',
      href: '/admin/fees?action=generate',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'send-reminders',
      title: 'Send Reminders',
      description: 'Send payment reminders to families',
      icon: '📧',
      href: '/admin/operations?tab=reminders',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'financial-reports',
      title: 'Financial Reports',
      description: 'Generate comprehensive financial reports',
      icon: '📊',
      href: '/admin/reports?tab=automated',
      color: 'from-orange-500 to-orange-700'
    }
  ];

  const moduleCards = [
    {
      id: 'fees',
      title: 'Fee Management',
      description: 'Manage fee structures, allocations, and billing cycles',
      icon: '💳',
      href: '/admin/fees',
      color: 'from-orange-500 to-orange-600',
      stats: stats
        ? [
            { label: 'Total Allocations', value: stats.totalFeeAllocations },
            { label: 'Paid Allocations', value: stats.paidAllocations },
            { label: 'Pending Allocations', value: stats.pendingAllocations }
          ]
        : []
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      description:
        'Record payments, track transactions, and manage payment history',
      icon: '💰',
      href: '/admin/payments',
      color: 'from-orange-500 to-orange-600',
      stats: stats
        ? [
            {
              label: 'Monthly Revenue',
              value: `₹${stats.totalRevenueThisMonth?.toLocaleString()}`
            },
            { label: 'Recent Payments', value: stats.recentPaymentActivity },
            {
              label: 'Collection Rate',
              value: `${stats.collectionEfficiency}%`
            }
          ]
        : []
    },
    {
      id: 'outstanding',
      title: 'Outstanding Dues',
      description:
        'Track overdue payments, manage collections, and follow up with families',
      icon: '⚠️',
      href: '/admin/fees?filter=overdue',
      color: 'from-red-500 to-red-600',
      stats: stats
        ? [
            {
              label: 'Total Outstanding',
              value: `₹${stats.totalOutstandingDues?.toLocaleString()}`
            },
            {
              label: 'Families Affected',
              value: stats.familiesWithOutstanding
            },
            { label: 'Overdue Allocations', value: stats.overdueAllocations }
          ]
        : []
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading financial data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex justify-between items-center animate-fade-in'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              Financial Management
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Unified hub for fees, payments and financial operations
            </p>
          </div>
          <div className='flex space-x-4'>
            <Link
              href='/admin/financials/analytics'
              className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              📈 Financial Analytics
            </Link>
            <Link
              href='/admin/reports'
              className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              📊 Reports & Analytics
            </Link>
          </div>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl animate-fade-in'>
            <div className='flex items-center'>
              <span className='text-red-500 mr-2'>⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Financial KPIs */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Monthly Revenue
                </p>
                <p className='text-2xl font-bold text-orange-600'>
                  ₹{stats?.totalRevenueThisMonth?.toLocaleString() || '0'}
                </p>
              </div>
              <div className='text-orange-500 text-2xl'>💰</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              Current month collections
            </p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Outstanding Dues
                </p>
                <p className='text-2xl font-bold text-red-600'>
                  ₹{stats?.totalOutstandingDues?.toLocaleString() || '0'}
                </p>
              </div>
              <div className='text-red-500 text-2xl'>⚠️</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Pending collections</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Collection Rate
                </p>
                <p className='text-2xl font-bold text-orange-600'>
                  {stats?.collectionEfficiency || 0}%
                </p>
              </div>
              <div className='text-orange-500 text-2xl'>📊</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Payment efficiency</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Recent Payments
                </p>
                <p className='text-2xl font-bold text-orange-700'>
                  {stats?.recentPaymentActivity || 0}
                </p>
              </div>
              <div className='text-orange-500 text-2xl'>🔄</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Last 7 days</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Quick Financial Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {quickActions.map(action => (
              <Link
                key={action.id}
                href={action.href}
                className='group p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md'
              >
                <div className='flex items-center mb-3'>
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white text-lg mr-3 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {action.icon}
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200'>
                      {action.title}
                    </h3>
                  </div>
                </div>
                <p className='text-sm text-gray-600'>{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Financial Modules */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {moduleCards.map(module => (
            <div
              key={module.id}
              className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'
            >
              {/* Module Header */}
              <div
                className={`bg-gradient-to-r ${module.color} p-6 text-white`}
              >
                <div className='flex items-center mb-4'>
                  <div className='text-3xl mr-4'>{module.icon}</div>
                  <div>
                    <h3 className='text-xl font-bold'>{module.title}</h3>
                    <p className='text-white/80 text-sm'>
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Module Stats */}
              <div className='p-6'>
                {stats && module.stats.length > 0 ? (
                  <div className='space-y-4 mb-6'>
                    {module.stats.map((stat, index) => (
                      <div
                        key={index}
                        className='flex justify-between items-center'
                      >
                        <span className='text-gray-600 text-sm'>
                          {stat.label}
                        </span>
                        <span className='font-semibold text-gray-900'>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-4 text-gray-500'>
                    Loading statistics...
                  </div>
                )}

                {/* Module Actions */}
                <div className='space-y-2'>
                  <Link
                    href={module.href}
                    className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center`}
                  >
                    Manage {module.title.split(' ')[0]}
                  </Link>
                  <Link
                    href={`${module.href}?action=add`}
                    className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center'
                  >
                    Quick Action
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Health Overview */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Financial Health Overview
          </h2>
          {stats ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='text-center p-4 bg-orange-50 rounded-xl'>
                <div className='text-2xl font-bold text-orange-600'>
                  {stats.paidAllocations}
                </div>
                <div className='text-sm text-orange-800'>Paid Allocations</div>
                <div className='text-xs text-gray-500 mt-1'>
                  {(
                    (stats.paidAllocations / stats.totalFeeAllocations) *
                    100
                  ).toFixed(1)}
                  % of total
                </div>
              </div>
              <div className='text-center p-4 bg-yellow-50 rounded-xl'>
                <div className='text-2xl font-bold text-yellow-600'>
                  {stats.pendingAllocations}
                </div>
                <div className='text-sm text-yellow-800'>
                  Pending Allocations
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  {(
                    (stats.pendingAllocations / stats.totalFeeAllocations) *
                    100
                  ).toFixed(1)}
                  % of total
                </div>
              </div>
              <div className='text-center p-4 bg-red-50 rounded-xl'>
                <div className='text-2xl font-bold text-red-600'>
                  {stats.overdueAllocations}
                </div>
                <div className='text-sm text-red-800'>Overdue Allocations</div>
                <div className='text-xs text-gray-500 mt-1'>
                  Require immediate attention
                </div>
              </div>
              <div className='text-center p-4 bg-orange-50 rounded-xl'>
                <div className='text-2xl font-bold text-orange-600'>
                  ₹{stats.averageMonthlyRevenue?.toLocaleString()}
                </div>
                <div className='text-sm text-orange-800'>Avg Monthly Revenue</div>
                <div className='text-xs text-gray-500 mt-1'>Last 6 months</div>
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-gray-400 text-4xl mb-4'>💰</div>
              <p className='text-gray-500'>Loading financial health data...</p>
            </div>
          )}
        </div>

        {/* Recent Financial Activity */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Recent Financial Activity
          </h2>
          <div className='text-center py-8'>
            <div className='text-gray-400 text-4xl mb-4'>📋</div>
            <p className='text-gray-500'>
              Recent activity tracking coming soon
            </p>
            <p className='text-sm text-gray-400 mt-2'>
              This will show recent payments, fee allocations, and financial
              transactions
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
