'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

interface PeopleStats {
  totalStudents: number;
  totalFamilies: number;
  totalUsers: number;
  activeStudents: number;
  recentEnrollments: number;
  pendingUsers: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export default function PeopleHubPage() {
  const [stats, setStats] = useState<PeopleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPeopleStats();
  }, []);

  const fetchPeopleStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Check if token exists before making API call
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/people/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Try to parse error response for more specific feedback
        try {
          const errorData = await response.json();
          setError(
            errorData.message ||
              `Failed to fetch people statistics (${response.status})`
          );
        } catch {
          setError(`Failed to fetch people statistics (${response.status})`);
        }
      }
    } catch (error) {
      // Provide more specific error messages
      if (error instanceof Error) {
        setError(`Network error: ${error.message}`);
      } else {
        setError('Network error: Unable to connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-student',
      title: 'Add New Student',
      description: 'Enroll a new student in the institute',
      icon: '👨‍🎓',
      href: '/admin/students?action=add',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'add-family',
      title: 'Add New Family',
      description: 'Register a new family in the system',
      icon: '👨‍👩‍👧‍👦',
      href: '/admin/families?action=add',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'add-user',
      title: 'Add New User',
      description: 'Create a new system user account',
      icon: '👤',
      href: '/admin/users?action=add',
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'bulk-import',
      title: 'Bulk Import',
      description: 'Import multiple records from spreadsheet',
      icon: '📊',
      href: '/admin/people/import',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const moduleCards = [
    {
      id: 'students',
      title: 'Student Records',
      description:
        'Manage student profiles, enrollment, and academic information',
      icon: '👨‍🎓',
      href: '/admin/students',
      color: 'from-orange-500 to-orange-600',
      stats: stats
        ? [
            { label: 'Total Students', value: stats.totalStudents },
            { label: 'Active Students', value: stats.activeStudents },
            { label: 'Recent Enrollments', value: stats.recentEnrollments }
          ]
        : []
    },
    {
      id: 'families',
      title: 'Family Management',
      description:
        'Manage family profiles, relationships, and contact information',
      icon: '👨‍👩‍👧‍👦',
      href: '/admin/families',
      color: 'from-orange-500 to-orange-600',
      stats: stats
        ? [
            { label: 'Total Families', value: stats.totalFamilies },
            // TODO: Replace with dynamic data from API
            {
              label: 'Multi-Child Families',
              value: Math.floor(stats.totalFamilies * 0.6)
            },
            { label: 'Average Family Size', value: '2.3' }
          ]
        : []
    },
    {
      id: 'users',
      title: 'User Accounts',
      description: 'Manage system users, roles, and access permissions',
      icon: '👤',
      href: '/admin/users',
      color: 'from-orange-500 to-orange-700',
      stats: stats
        ? [
            { label: 'Total Users', value: stats.totalUsers },
            {
              label: 'Active Users',
              value: stats.totalUsers - stats.pendingUsers
            },
            { label: 'Pending Users', value: stats.pendingUsers }
          ]
        : []
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading people data...</div>
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
              People Management
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Unified hub for managing students, families, and users
            </p>
          </div>
          <div className='flex space-x-4'>
            <Link
              href='/admin/people/search'
              className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              🔍 Advanced Search
            </Link>
            <Link
              href='/admin/people/reports'
              className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              📊 People Reports
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

        {/* Module Cards */}
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
                    Manage {module.title}
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

        {/* Recent Activity */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Recent Activity
          </h2>
          <div className='text-center py-8'>
            <div className='text-gray-400 text-4xl mb-4'>📋</div>
            <p className='text-gray-500'>
              Recent activity tracking coming soon
            </p>
            <p className='text-sm text-gray-400 mt-2'>
              This will show recent enrollments, family registrations, and user
              activities
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
