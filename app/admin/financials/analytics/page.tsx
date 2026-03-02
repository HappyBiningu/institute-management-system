'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

interface FinancialAnalytics {
  revenueGrowth: number;
  collectionTrend: string;
  averagePaymentTime: number;
  topPayingFamilies: Array<{
    familyName: string;
    totalPaid: number;
    paymentCount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    collections: number;
    outstanding: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
}

export default function FinancialAnalyticsPage() {
  const [analytics, setAnalytics] = useState<FinancialAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/financials/analytics?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading financial analytics...</div>
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
              Financial Analytics
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Comprehensive insights into financial performance and trends
            </p>
          </div>
          <div className='flex space-x-4'>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className='input-field'
            >
              <option value='1month'>Last Month</option>
              <option value='3months'>Last 3 Months</option>
              <option value='6months'>Last 6 Months</option>
              <option value='1year'>Last Year</option>
            </select>
            <Link
              href='/admin/financials'
              className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              ← Back to Financial Hub
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

        {/* Key Financial Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Revenue Growth
                </p>
                <p className='text-2xl font-bold text-orange-600'>+15.3%</p>
              </div>
              <div className='text-orange-500 text-2xl'>📈</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>vs previous period</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Collection Rate
                </p>
                <p className='text-2xl font-bold text-orange-600'>87.5%</p>
              </div>
              <div className='text-orange-500 text-2xl'>🎯</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>payment efficiency</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Avg Payment Time
                </p>
                <p className='text-2xl font-bold text-orange-700'>12 days</p>
              </div>
              <div className='text-orange-500 text-2xl'>⏱️</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>from due date</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Outstanding Ratio
                </p>
                <p className='text-2xl font-bold text-orange-600'>12.5%</p>
              </div>
              <div className='text-orange-500 text-2xl'>⚠️</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>of total allocations</p>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Revenue & Collection Trends
          </h2>
          <div className='text-center py-8'>
            <div className='text-gray-400 text-4xl mb-4'>📊</div>
            <p className='text-gray-500'>Revenue trend charts coming soon</p>
            <p className='text-sm text-gray-400 mt-2'>
              This will show monthly revenue, collection rates, and outstanding
              dues trends
            </p>
          </div>
        </div>

        {/* Financial Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Top Paying Families */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Top Contributing Families
            </h2>
            <div className='space-y-4'>
              {[
                { name: 'Johnson Family', amount: 45000, payments: 6 },
                { name: 'Smith Family', amount: 38000, payments: 5 },
                { name: 'Davis Family', amount: 35000, payments: 4 },
                { name: 'Wilson Family', amount: 32000, payments: 6 },
                { name: 'Brown Family', amount: 28000, payments: 4 }
              ].map((family, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'
                >
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      {family.name}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {family.payments} payments made
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-lg font-bold text-orange-600'>
                      ₹{family.amount.toLocaleString()}
                    </div>
                    <div className='text-xs text-gray-500'>total paid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Payment Method Distribution
            </h2>
            <div className='space-y-4'>
              {[
                {
                  method: 'Bank Transfer',
                  count: 45,
                  amount: 180000,
                  percentage: 65
                },
                { method: 'Cash', count: 28, amount: 75000, percentage: 27 },
                { method: 'Cheque', count: 12, amount: 22000, percentage: 8 }
              ].map((method, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-gray-900'>
                      {method.method}
                    </span>
                    <span className='text-sm text-gray-600'>
                      ₹{method.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-orange-600 h-2 rounded-full'
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>{method.count} transactions</span>
                    <span>{method.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Outstanding Analysis */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Outstanding Dues Analysis
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-4 bg-yellow-50 rounded-xl'>
              <div className='text-3xl font-bold text-yellow-600'>15</div>
              <div className='text-sm text-yellow-800'>0-30 Days Overdue</div>
              <div className='text-xs text-gray-500 mt-1'>₹45,000 total</div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded-xl'>
              <div className='text-3xl font-bold text-orange-600'>8</div>
              <div className='text-sm text-orange-800'>31-60 Days Overdue</div>
              <div className='text-xs text-gray-500 mt-1'>₹28,000 total</div>
            </div>
            <div className='text-center p-4 bg-red-50 rounded-xl'>
              <div className='text-3xl font-bold text-red-600'>3</div>
              <div className='text-sm text-red-800'>60+ Days Overdue</div>
              <div className='text-xs text-gray-500 mt-1'>₹15,000 total</div>
            </div>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Financial Health Score
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='relative w-24 h-24 mx-auto mb-4'>
                <svg
                  className='w-24 h-24 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='2'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='2'
                    strokeDasharray='87.5, 100'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-xl font-bold text-orange-600'>87%</span>
                </div>
              </div>
              <div className='text-sm font-medium text-gray-900'>
                Collection Rate
              </div>
              <div className='text-xs text-gray-500'>Excellent</div>
            </div>

            <div className='text-center'>
              <div className='relative w-24 h-24 mx-auto mb-4'>
                <svg
                  className='w-24 h-24 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='2'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#3b82f6'
                    strokeWidth='2'
                    strokeDasharray='75, 100'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-xl font-bold text-orange-600'>75%</span>
                </div>
              </div>
              <div className='text-sm font-medium text-gray-900'>
                Payment Timeliness
              </div>
              <div className='text-xs text-gray-500'>Good</div>
            </div>

            <div className='text-center'>
              <div className='relative w-24 h-24 mx-auto mb-4'>
                <svg
                  className='w-24 h-24 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='2'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#f59e0b'
                    strokeWidth='2'
                    strokeDasharray='65, 100'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-xl font-bold text-yellow-600'>65%</span>
                </div>
              </div>
              <div className='text-sm font-medium text-gray-900'>
                Revenue Growth
              </div>
              <div className='text-xs text-gray-500'>Average</div>
            </div>

            <div className='text-center'>
              <div className='relative w-24 h-24 mx-auto mb-4'>
                <svg
                  className='w-24 h-24 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='2'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='2'
                    strokeDasharray='92, 100'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-xl font-bold text-orange-600'>92%</span>
                </div>
              </div>
              <div className='text-sm font-medium text-gray-900'>
                Family Satisfaction
              </div>
              <div className='text-xs text-gray-500'>Excellent</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Financial Recommendations
          </h2>
          <div className='space-y-4'>
            <div className='flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200'>
              <div className='text-orange-500 text-xl mr-3'>✅</div>
              <div>
                <h3 className='font-semibold text-orange-800'>
                  Excellent Collection Rate
                </h3>
                <p className='text-sm text-orange-700'>
                  Your 87% collection rate is above industry average. Continue
                  current practices.
                </p>
              </div>
            </div>
            <div className='flex items-start p-4 bg-yellow-50 rounded-xl border border-yellow-200'>
              <div className='text-yellow-500 text-xl mr-3'>⚠️</div>
              <div>
                <h3 className='font-semibold text-yellow-800'>
                  Follow Up on Overdue Payments
                </h3>
                <p className='text-sm text-yellow-700'>
                  3 families have payments overdue by 60+ days. Consider
                  personal follow-up.
                </p>
              </div>
            </div>
            <div className='flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200'>
              <div className='text-orange-500 text-xl mr-3'>💡</div>
              <div>
                <h3 className='font-semibold text-orange-800'>
                  Promote Digital Payments
                </h3>
                <p className='text-sm text-orange-700'>
                  Bank transfers show highest success rate. Consider
                  incentivizing digital payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
