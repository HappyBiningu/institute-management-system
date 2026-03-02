'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

interface AcademicStats {
  totalCourses: number;
  totalServices: number;
  totalAcademicLogs: number;
  activeCourses: number;
  activeServices: number;
  recentLogs: number;
  totalEnrollments: number;
  averageProgress: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export default function AcademicsHubPage() {
  const [stats, setStats] = useState<AcademicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAcademicStats();
  }, []);

  const fetchAcademicStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/academic/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch academic statistics');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-course',
      title: 'Add New Course',
      description: 'Create a new academic course offering',
      icon: '📚',
      href: '/admin/courses?action=add',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'add-service',
      title: 'Add New Service',
      description: 'Create a new institute service',
      icon: '🚌',
      href: '/admin/services?action=add',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'create-log',
      title: 'Create Academic Log',
      description: 'Record student academic progress',
      icon: '📝',
      href: '/admin/academic-logs?action=add',
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'bulk-import',
      title: 'Bulk Operations',
      description: 'Import courses or manage enrollments',
      icon: '📊',
      href: '/admin/academic/bulk',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const moduleCards = [
    {
      id: 'courses',
      title: 'Course Management',
      description:
        'Manage academic courses, curriculum, and course-related fee structures',
      icon: '📚',
      href: '/admin/courses',
      color: 'from-orange-500 to-orange-600',
      stats: stats
        ? [
            { label: 'Total Courses', value: stats.totalCourses },
            { label: 'Active Courses', value: stats.activeCourses },
            {
              label: 'Course Enrollments',
              value: Math.floor(stats.totalEnrollments * 0.7)
            }
          ]
        : []
    },
    {
      id: 'services',
      title: 'Service Management',
      description:
        'Manage institute services like transport, meals, and extracurricular activities',
      icon: '🚌',
      href: '/admin/services',
      color: 'from-orange-500 to-orange-600',
      stats: stats
        ? [
            { label: 'Total Services', value: stats.totalServices },
            { label: 'Active Services', value: stats.activeServices },
            {
              label: 'Service Subscriptions',
              value: Math.floor(stats.totalEnrollments * 0.3)
            }
          ]
        : []
    },
    {
      id: 'academic-logs',
      title: 'Academic Progress',
      description:
        'Track student academic performance, assignments, and progress reports',
      icon: '📝',
      href: '/admin/academic-logs',
      color: 'from-orange-500 to-orange-700',
      stats: stats
        ? [
            { label: 'Total Logs', value: stats.totalAcademicLogs },
            { label: 'Recent Logs', value: stats.recentLogs },
            { label: 'Average Progress', value: `${stats.averageProgress}%` }
          ]
        : []
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading academic data...</div>
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
              Academic Management
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Unified hub for courses, services and student progress
            </p>
          </div>
          <div className='flex space-x-4'>
            <Link
              href='/admin/academic/analytics'
              className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              📈 Academic Analytics
            </Link>
            <Link
              href='/admin/academic/reports'
              className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              📊 Academic Reports
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

        {/* Quick Actions */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Quick Actions
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

        {/* Academic Overview Cards */}
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
                    Add New
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Performance Overview */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Academic Performance Overview
          </h2>
          {stats ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='text-center p-4 bg-orange-50 rounded-xl'>
                <div className='text-2xl font-bold text-orange-600'>
                  {stats.totalEnrollments}
                </div>
                <div className='text-sm text-orange-800'>Total Enrollments</div>
              </div>
              <div className='text-center p-4 bg-orange-50 rounded-xl'>
                <div className='text-2xl font-bold text-orange-600'>
                  {stats.averageProgress}%
                </div>
                <div className='text-sm text-orange-800'>Average Progress</div>
              </div>
              <div className='text-center p-4 bg-orange-50 rounded-xl'>
                <div className='text-2xl font-bold text-orange-700'>
                  {stats.recentLogs}
                </div>
                <div className='text-sm text-orange-800'>
                  Recent Logs (7 days)
                </div>
              </div>
              <div className='text-center p-4 bg-orange-50 rounded-xl'>
                <div className='text-2xl font-bold text-orange-600'>
                  {stats.activeCourses + stats.activeServices}
                </div>
                <div className='text-sm text-orange-800'>Active Offerings</div>
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-gray-400 text-4xl mb-4'>📊</div>
              <p className='text-gray-500'>Loading performance data...</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Recent Academic Activity
          </h2>
          <div className='text-center py-8'>
            <div className='text-gray-400 text-4xl mb-4'>📋</div>
            <p className='text-gray-500'>
              Recent activity tracking coming soon
            </p>
            <p className='text-sm text-gray-400 mt-2'>
              This will show recent course enrollments, academic log entries,
              and service subscriptions
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
