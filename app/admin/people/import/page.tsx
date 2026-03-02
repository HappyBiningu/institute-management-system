'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

export default function PeopleBulkImportPage() {
  return (
    <AdminLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex justify-between items-center animate-fade-in'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              Bulk Import
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Import students, families, and users in bulk from CSV or Excel
              files
            </p>
          </div>
          <Link
            href='/admin/people'
            className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            ← Back to People Hub
          </Link>
        </div>

        {/* Coming Soon Message */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center'>
          <div className='text-6xl mb-6'>📁</div>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Bulk Import Coming Soon
          </h2>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            We&apos;re developing a comprehensive bulk import system that will
            allow you to efficiently import large numbers of students, families,
            and users from various file formats.
          </p>

          {/* Planned Features */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
            <div className='p-8 bg-orange-50 rounded-xl text-left'>
              <div className='text-3xl mb-4'>📊</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Supported Formats
              </h3>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  CSV files with custom delimiters
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Excel files (.xlsx, .xls)
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Google Sheets integration
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  JSON data import
                </li>
              </ul>
            </div>

            <div className='p-8 bg-orange-50 rounded-xl text-left'>
              <div className='text-3xl mb-4'>🔧</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Smart Features
              </h3>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Automatic data validation
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Duplicate detection and merging
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Field mapping and transformation
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Progress tracking and error reporting
                </li>
              </ul>
            </div>

            <div className='p-8 bg-orange-50 rounded-xl text-left'>
              <div className='text-3xl mb-4'>👥</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Import Types
              </h3>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Student records with enrollment data
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Family information and relationships
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  User accounts and permissions
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Course enrollments and services
                </li>
              </ul>
            </div>

            <div className='p-8 bg-orange-50 rounded-xl text-left'>
              <div className='text-3xl mb-4'>🛡️</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Safety & Security
              </h3>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Preview before import
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Rollback capabilities
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Audit trail and logging
                </li>
                <li className='flex items-center'>
                  <span className='text-orange-500 mr-2'>✓</span>
                  Data encryption and privacy
                </li>
              </ul>
            </div>
          </div>

          {/* Template Download Section */}
          <div className='mt-12 p-6 bg-gray-50 rounded-xl'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Import Templates
            </h3>
            <p className='text-gray-600 mb-4'>
              When available, you&apos;ll be able to download template files to
              ensure your data is formatted correctly.
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                disabled
                className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'
              >
                📄 Student Template
              </button>
              <button
                disabled
                className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'
              >
                🏠 Family Template
              </button>
              <button
                disabled
                className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'
              >
                👤 User Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
