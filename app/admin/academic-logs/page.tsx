'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  student: {
    id: string;
    name: string;
    grade?: string;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
  };
}

interface Student {
  id: string;
  name: string;
  grade?: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  description?: string;
}

function AdminAcademicLogsContent() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<AcademicLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AcademicLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterLogType, setFilterLogType] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch academic logs
      const logsResponse = await fetch('/api/academic-logs');
      if (!logsResponse.ok) throw new Error('Failed to fetch academic logs');
      const logsData = await logsResponse.json();
      setLogs(logsData);

      // Fetch students
      const studentsResponse = await fetch('/api/students');
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      }

      // Fetch teachers (users with teacher role)
      const teachersResponse = await fetch('/api/users?role=teacher');
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        setTeachers(teachersData);
      }

      // Fetch courses
      const coursesResponse = await fetch('/api/courses');
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Set initial filters from URL parameters
    const student = searchParams.get('student');
    const teacher = searchParams.get('teacher');
    const course = searchParams.get('course');
    const logType = searchParams.get('logType');
    const search = searchParams.get('search');

    if (student) setFilterStudent(student);
    if (teacher) setFilterTeacher(teacher);
    if (course) setFilterCourse(course);
    if (logType) setFilterLogType(logType);
    if (search) setSearchTerm(search);
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        log =>
          log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Student filter
    if (filterStudent) {
      filtered = filtered.filter(log => log.student.id === filterStudent);
    }

    // Teacher filter
    if (filterTeacher) {
      filtered = filtered.filter(log => log.teacher.id === filterTeacher);
    }

    // Log type filter
    if (filterLogType) {
      filtered = filtered.filter(log => log.logType === filterLogType);
    }

    // Privacy filter
    if (filterPrivacy) {
      if (filterPrivacy === 'public') {
        filtered = filtered.filter(log => !log.isPrivate);
      } else if (filterPrivacy === 'private') {
        filtered = filtered.filter(log => log.isPrivate);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof AcademicLog];
      let bValue: any = b[sortBy as keyof AcademicLog];

      if (sortBy === 'student') {
        aValue = a.student.name;
        bValue = b.student.name;
      } else if (sortBy === 'teacher') {
        aValue = a.teacher.name;
        bValue = b.teacher.name;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredLogs(filtered);
  }, [
    logs,
    searchTerm,
    filterStudent,
    filterTeacher,
    filterLogType,
    filterPrivacy,
    sortBy,
    sortOrder
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStudent('');
    setFilterTeacher('');
    setFilterCourse('');
    setFilterLogType('');
    setFilterPrivacy('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const getLogTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ACHIEVEMENT':
        return 'bg-orange-100 text-orange-800';
      case 'CONCERN':
        return 'bg-red-100 text-red-800';
      case 'GENERAL':
        return 'bg-orange-100 text-orange-800';
      case 'PROGRESS':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Academic Logs Management
            </h1>
            <p className='mt-2 text-gray-600'>
              Comprehensive oversight of all academic activities and student
              progress
            </p>
          </div>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-orange-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-orange-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Logs</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {logs.length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-orange-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-orange-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Public Logs</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {logs.filter(log => !log.isPrivate).length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-yellow-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-yellow-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Private Logs
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {logs.filter(log => log.isPrivate).length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-orange-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-orange-700'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>This Week</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {
                    logs.filter(log => {
                      const logDate = new Date(log.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return logDate >= weekAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            {/* Search */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search
              </label>
              <input
                type='text'
                placeholder='Search logs, students, teachers...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              />
            </div>

            {/* Student Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Student
              </label>
              <select
                value={filterStudent}
                onChange={e => setFilterStudent(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value=''>All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.grade && `(${student.grade})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Teacher
              </label>
              <select
                value={filterTeacher}
                onChange={e => setFilterTeacher(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value=''>All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Log Type Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Log Type
              </label>
              <select
                value={filterLogType}
                onChange={e => setFilterLogType(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value=''>All Types</option>
                <option value='ACHIEVEMENT'>Achievement</option>
                <option value='CONCERN'>Concern</option>
                <option value='GENERAL'>General</option>
                <option value='PROGRESS'>Progress</option>
              </select>
            </div>
          </div>

          <div className='flex flex-wrap gap-4 items-center'>
            {/* Privacy Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Privacy
              </label>
              <select
                value={filterPrivacy}
                onChange={e => setFilterPrivacy(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value=''>All Logs</option>
                <option value='public'>Public Only</option>
                <option value='private'>Private Only</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value='createdAt'>Date Created</option>
                <option value='title'>Title</option>
                <option value='student'>Student Name</option>
                <option value='teacher'>Teacher Name</option>
                <option value='logType'>Log Type</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Order
              </label>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value='desc'>Newest First</option>
                <option value='asc'>Oldest First</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className='flex items-end'>
              <button
                onClick={clearFilters}
                className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className='mt-4 text-sm text-gray-600'>
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>

        {/* Academic Logs Table */}
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Log Details
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Student
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Teacher
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type & Privacy
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredLogs.map(log => (
                  <tr key={log.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {log.title}
                        </div>
                        <div className='text-sm text-gray-500 truncate max-w-xs'>
                          {log.content.substring(0, 100)}...
                        </div>
                        {log.subject && (
                          <div className='text-xs text-orange-600 mt-1'>
                            Subject: {log.subject}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {log.student.name}
                      </div>
                      {log.student.grade && (
                        <div className='text-sm text-gray-500'>
                          {log.student.grade}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {log.teacher.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {log.teacher.email}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col space-y-1'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLogTypeColor(log.logType)}`}
                        >
                          {log.logType}
                        </span>
                        {log.isPrivate && (
                          <span className='inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'>
                            <svg
                              className='w-3 h-3 mr-1'
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
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium'>
                      <Link
                        href={`/admin/academic-logs/${log.id}`}
                        className='text-orange-600 hover:text-orange-900'
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className='text-center py-12'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No academic logs found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {logs.length === 0
                  ? 'No academic logs have been created yet.'
                  : 'Try adjusting your filters to see more results.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminAcademicLogs() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminAcademicLogsContent />
    </Suspense>
  );
}
