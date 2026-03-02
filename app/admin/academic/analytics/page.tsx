'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

export default function AcademicAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    // Set loading to true when period changes
    setLoading(true);

    // Simulate loading for now
    const timer = setTimeout(() => setLoading(false), 1000);

    // Cleanup function to clear timer
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading analytics data...</div>
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
              Academic Analytics
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Comprehensive insights into academic performance and trends
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
              href='/admin/academic'
              className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              ← Back to Academic Hub
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

        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Enrollment Growth
                </p>
                <p className='text-2xl font-bold text-orange-600'>+12.5%</p>
              </div>
              <div className='text-orange-500 text-2xl'>📈</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>vs previous period</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Average Progress
                </p>
                <p className='text-2xl font-bold text-orange-600'>78.3%</p>
              </div>
              <div className='text-orange-500 text-2xl'>🎯</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>across all courses</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Active Teachers
                </p>
                <p className='text-2xl font-bold text-orange-700'>8</p>
              </div>
              <div className='text-orange-500 text-2xl'>👨‍🏫</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>managing courses</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Completion Rate
                </p>
                <p className='text-2xl font-bold text-orange-600'>85.7%</p>
              </div>
              <div className='text-orange-500 text-2xl'>✅</div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>course completion</p>
          </div>
        </div>

        {/* Progress Distribution */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Student Progress Distribution
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center p-4 bg-orange-50 rounded-xl'>
              <div className='text-3xl font-bold text-orange-600'>32%</div>
              <div className='text-sm text-orange-800'>Excellent (90-100%)</div>
              <div className='text-xs text-gray-500 mt-1'>18 students</div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded-xl'>
              <div className='text-3xl font-bold text-orange-600'>28%</div>
              <div className='text-sm text-orange-800'>Good (80-89%)</div>
              <div className='text-xs text-gray-500 mt-1'>16 students</div>
            </div>
            <div className='text-center p-4 bg-yellow-50 rounded-xl'>
              <div className='text-3xl font-bold text-yellow-600'>25%</div>
              <div className='text-sm text-yellow-800'>Average (70-79%)</div>
              <div className='text-xs text-gray-500 mt-1'>14 students</div>
            </div>
            <div className='text-center p-4 bg-red-50 rounded-xl'>
              <div className='text-3xl font-bold text-red-600'>15%</div>
              <div className='text-sm text-red-800'>
                Needs Support (&lt;70%)
              </div>
              <div className='text-xs text-gray-500 mt-1'>8 students</div>
            </div>
          </div>
        </div>

        {/* Academic Performance Summary */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Academic Performance Summary
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-4 bg-orange-50 rounded-xl'>
              <div className='text-3xl font-bold text-orange-600'>85%</div>
              <div className='text-sm text-orange-800'>Students Excelling</div>
              <div className='text-xs text-gray-500 mt-1'>
                Above 80% progress
              </div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded-xl'>
              <div className='text-3xl font-bold text-orange-600'>12</div>
              <div className='text-sm text-orange-800'>Active Courses</div>
              <div className='text-xs text-gray-500 mt-1'>
                Currently running
              </div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded-xl'>
              <div className='text-3xl font-bold text-orange-700'>95%</div>
              <div className='text-sm text-orange-800'>Attendance Rate</div>
              <div className='text-xs text-gray-500 mt-1'>Overall average</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Advanced Analytics (Coming Soon)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                📈 Performance Trends
              </h3>
              <p className='text-sm text-gray-600'>
                Track student progress over time with detailed trend analysis
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                🎯 Predictive Analytics
              </h3>
              <p className='text-sm text-gray-600'>
                AI-powered insights to predict student success and intervention
                needs
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                📊 Comparative Analysis
              </h3>
              <p className='text-sm text-gray-600'>
                Compare performance across courses, teachers, and time periods
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                📋 Custom Reports
              </h3>
              <p className='text-sm text-gray-600'>
                Generate customized academic reports for stakeholders
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
