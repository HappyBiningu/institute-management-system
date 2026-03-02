'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear the cookie as well
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );
  }

  const navigation = [
    {
      name: 'Overview',
      href: '/admin/dashboard',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z'
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      description: 'Institute overview and key metrics'
    },
    {
      name: 'People',
      href: '/admin/people',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      description: 'Students, families and users'
    },
    {
      name: 'Academics',
      href: '/admin/academic',
      icon: (
        <svg
          className='w-5 h-5'
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
      ),
      color: 'from-orange-500 to-orange-600',
      description: 'Courses, services and student progress'
    },
    {
      name: 'Financials',
      href: '/admin/financials',
      icon: (
        <svg
          className='w-5 h-5'
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
      ),
      color: 'from-orange-500 to-orange-600',
      description: 'Fees, payments and billing'
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      description: 'Analytics and automated reports'
    },
    {
      name: 'Operations',
      href: '/admin/operations',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      description: 'System automation and settings'
    }
  ];

  return (
    <div className='min-h-screen gradient-bg'>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}
      >
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm'
          onClick={() => setSidebarOpen(false)}
        />
        <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-md'>
          <div className='absolute top-0 right-0 -mr-12 pt-2'>
            <button
              type='button'
              className='ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50'
              onClick={() => setSidebarOpen(false)}
            >
              <span className='sr-only'>Close sidebar</span>
              <span className='text-white text-xl'>×</span>
            </button>
          </div>
          <div className='flex-1 h-0 pt-5 pb-4 overflow-y-auto'>
            <div className='flex-shrink-0 flex items-center px-6 mb-8'>
              <img src='/logo.webp' alt='Rand Training College' className='h-10 w-auto mr-3' />
              <h1 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                Rand Training College
              </h1>
            </div>
            <nav className='px-3 space-y-2'>
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='group flex items-center px-4 py-3 text-base font-medium rounded-xl text-gray-700 hover:bg-white/50 hover:text-gray-900 transition-all duration-200'
                >
                  <div
                    className={`mr-4 h-8 w-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200`}
                  >
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className='hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0'>
        <div className='flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-md border-r border-gray-200/50'>
          <div className='flex-1 flex flex-col pt-8 pb-4 overflow-y-auto'>
            <div className='flex items-center flex-shrink-0 px-6 mb-8'>
              <img src='/logo.webp' alt='Rand Training College' className='h-12 w-auto mr-4' />
              <div>
                <h1 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                  Rand Training College
                </h1>
                <p className='text-xs text-gray-500 font-medium'>
                  Management System
                </p>
              </div>
            </div>
            <nav className='flex-1 px-4 space-y-2'>
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-white/70 hover:text-gray-900 transition-all duration-200 hover:shadow-md'
                >
                  <div
                    className={`mr-4 h-10 w-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200`}
                  >
                    {item.icon}
                  </div>
                  <span className='font-medium'>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='md:pl-72 flex flex-col flex-1'>
        <div className='sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3'>
          <button
            type='button'
            className='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/25 shadow-lg'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <span className='text-xl'>☰</span>
          </button>
        </div>

        {/* Top bar */}
        <div className='bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50'>
          <div className='px-6 lg:px-8'>
            <div className='flex justify-between h-20'>
              <div className='flex items-center'>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                  Admin Panel
                </h2>
              </div>
              <div className='flex items-center space-x-6'>
                <div className='text-right'>
                  <p className='text-sm font-medium text-gray-900'>
                    Welcome back!
                  </p>
                  <p className='text-xs text-gray-500'>{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='flex-1 p-6 lg:p-8'>
          <div className='max-w-7xl mx-auto animate-fade-in'>{children}</div>
        </main>
      </div>
    </div>
  );
}
