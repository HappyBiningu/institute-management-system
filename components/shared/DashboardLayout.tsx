'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  user?: {
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  headerActions,
  user,
  onLogout
}: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <img src='/logo.webp' alt='Rand Training College' className='h-10 w-auto mr-3' />
              <h1 className='text-2xl font-bold text-gray-900'>Rand Training College</h1>
              {subtitle && (
                <span className='ml-4 px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm font-medium rounded-full'>
                  {subtitle}
                </span>
              )}
            </div>
            <div className='flex items-center space-x-4'>
              {headerActions}
              {user && (
                <div className='text-right'>
                  <p className='text-sm text-gray-600'>Welcome,</p>
                  <p className='font-semibold text-gray-900'>{user.name}</p>
                </div>
              )}
              <button
                onClick={onLogout}
                className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>{title}</h2>
          {subtitle && <p className='text-gray-600 mt-2'>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
