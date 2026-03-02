'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

interface AcademicLog {
  id: string;
  title: string;
  content: string;
  logType: string;
  subject?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    grade?: string;
    family: {
      id: string;
      name: string;
    };
  };
  teacher: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AcademicLogDetail() {
  const params = useParams();
  const router = useRouter();
  const [log, setLog] = useState<AcademicLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logId = params.id as string;

  const fetchLog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/academic-logs/${logId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Academic log not found');
        } else {
          throw new Error('Failed to fetch academic log');
        }
        return;
      }

      const data = await response.json();
      setLog(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch academic log'
      );
    } finally {
      setLoading(false);
    }
  }, [logId]);

  useEffect(() => {
    if (logId) {
      fetchLog();
    }
  }, [logId, fetchLog]);

  const getLogTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ACHIEVEMENT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CONCERN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'GENERAL':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'PROGRESS':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600'></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !log) {
    return (
      <AdminLayout>
        <div className='text-center py-12'>
          <div className='mx-auto h-12 w-12 text-red-400 mb-4'>
            <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Academic Log Not Found
          </h3>
          <p className='text-gray-500 mb-4'>{error}</p>
          <Link
            href='/admin/academic-logs'
            className='inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700'
          >
            ← Back to Academic Logs
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Link
              href='/admin/academic-logs'
              className='inline-flex items-center text-gray-500 hover:text-gray-700'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back to Academic Logs
            </Link>
          </div>
          <div className='flex space-x-3'>
            <Link
              href={`/admin/academic-logs?student=${log.student.id}`}
              className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700'
            >
              View All Student Logs
            </Link>
            <Link
              href={`/admin/academic-logs?teacher=${log.teacher.id}`}
              className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700'
            >
              View All Teacher Logs
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Academic Log Details */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-start justify-between mb-6'>
                <div className='flex-1'>
                  <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                    {log.title}
                  </h1>
                  <div className='flex items-center space-x-4 text-sm text-gray-500'>
                    <span>
                      Created: {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                    {log.updatedAt !== log.createdAt && (
                      <span>
                        Updated: {new Date(log.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex flex-col space-y-2'>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getLogTypeColor(log.logType)}`}
                  >
                    {log.logType}
                  </span>
                  {log.isPrivate && (
                    <span className='inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-200'>
                      <svg
                        className='w-4 h-4 mr-1'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Private
                    </span>
                  )}
                </div>
              </div>

              {log.subject && (
                <div className='mb-4'>
                  <span className='inline-flex items-center px-3 py-1 text-sm font-medium bg-orange-50 text-orange-700 rounded-full border border-orange-200'>
                    Subject: {log.subject}
                  </span>
                </div>
              )}

              <div className='prose max-w-none'>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Log Content
                </h3>
                <div className='bg-gray-50 rounded-lg p-4 border'>
                  <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>
                    {log.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Student Information */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Student Information
              </h3>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Name
                  </label>
                  <p className='text-gray-900'>{log.student.name}</p>
                </div>
                {log.student.grade && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Grade
                    </label>
                    <p className='text-gray-900'>{log.student.grade}</p>
                  </div>
                )}
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Family
                  </label>
                  <p className='text-gray-900'>{log.student.family.name}</p>
                </div>
                <div className='pt-2'>
                  <Link
                    href={`/admin/students/${log.student.id}`}
                    className='text-orange-600 hover:text-orange-800 text-sm font-medium'
                  >
                    View Student Profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Teacher Information */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Teacher Information
              </h3>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Name
                  </label>
                  <p className='text-gray-900'>{log.teacher.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Email
                  </label>
                  <p className='text-gray-900'>{log.teacher.email}</p>
                </div>
                <div className='pt-2'>
                  <Link
                    href={`/admin/users/${log.teacher.id}`}
                    className='text-orange-600 hover:text-orange-800 text-sm font-medium'
                  >
                    View Teacher Profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <Link
                  href={`/admin/academic-logs?student=${log.student.id}`}
                  className='block w-full text-center px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors'
                >
                  All Logs for {log.student.name}
                </Link>
                <Link
                  href={`/admin/academic-logs?teacher=${log.teacher.id}`}
                  className='block w-full text-center px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors'
                >
                  All Logs by {log.teacher.name}
                </Link>
                <Link
                  href={`/admin/academic-logs?logType=${log.logType}`}
                  className='block w-full text-center px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors'
                >
                  All {log.logType} Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
