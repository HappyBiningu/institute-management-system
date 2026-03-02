'use client';

import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div className='animate-fade-in'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Dashboard
          </h1>
          <p className='mt-2 text-lg text-gray-600'>
            Welcome to the Rand Training College System
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up'>
          <div className='card-compact group hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300'>
                  <svg
                    className='w-7 h-7 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 14l9-5-9-5-9 5 9 5z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-6 flex-1'>
                <dt className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  Total Students
                </dt>
                <dd className='text-3xl font-bold text-gray-900 mt-1'>-</dd>
              </div>
            </div>
          </div>

          <div className='card-compact group hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300'>
                  <svg
                    className='w-7 h-7 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-6 flex-1'>
                <dt className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  Active Courses
                </dt>
                <dd className='text-3xl font-bold text-gray-900 mt-1'>1</dd>
              </div>
            </div>
          </div>

          <div className='card-compact group hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300'>
                  <svg
                    className='w-7 h-7 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-6 flex-1'>
                <dt className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  This Month Collection
                </dt>
                <dd className='text-3xl font-bold text-gray-900 mt-1'>₹-</dd>
              </div>
            </div>
          </div>

          <div className='card-compact group hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300'>
                  <svg
                    className='w-7 h-7 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-6 flex-1'>
                <dt className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  Outstanding Dues
                </dt>
                <dd className='text-3xl font-bold text-gray-900 mt-1'>₹-</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='card animate-slide-up'>
          <h3 className='text-2xl font-bold text-gray-900 mb-8'>
            Quick Actions
          </h3>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <a
              href='/admin/courses'
              className='group relative bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
            >
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Manage Courses
              </h3>
              <p className='text-gray-600 font-medium'>
                Create and manage course offerings with fee structures
              </p>
            </a>

            <a
              href='/admin/services'
              className='group relative bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
            >
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Manage Services
              </h3>
              <p className='text-gray-600 font-medium'>
                Create and manage additional services like transportation
              </p>
            </a>

            <a
              href='/admin/students'
              className='group relative bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
            >
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 14l9-5-9-5-9 5 9 5z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Manage Students
              </h3>
              <p className='text-gray-600 font-medium'>
                Enroll and manage student records and subscriptions
              </p>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className='card animate-slide-up'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6'>
            Recent Activity
          </h3>
          <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>📊</span>
            </div>
            <p className='text-gray-600 font-medium'>
              No recent activity to display.
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              Activity will appear here as you use the system.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
