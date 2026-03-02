'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MyCoursesView from '../components/MyCoursesView';
import MyFeesView from '../components/MyFeesView';
import MyAcademicLogsView from '../components/MyAcademicLogsView';
import AssignmentsView from '../components/AssignmentsView';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  dateOfBirth: string;
  enrollmentDate: string;
  family: {
    name: string;
    email: string;
    phone: string;
  };
}

interface DashboardStats {
  totalCourses: number;
  totalServices: number;
  currentMonthFee: number;
  outstandingDues: number;
  academicLogs: number;
  achievements: number;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalServices: 0,
    currentMonthFee: 0,
    outstandingDues: 0,
    academicLogs: 0,
    achievements: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'STUDENT') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchStudentData();
  }, [router]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');

      // In a real implementation, you would fetch student-specific data
      // For now, we'll use mock data since we don't have student-specific APIs

      // Mock student profile data
      setStudentProfile({
        id: 'student-1',
        name: 'Emma Johnson',
        grade: 'Grade 11',
        studentId: 'STU001',
        dateOfBirth: '2007-03-12',
        enrollmentDate: '2023-08-15',
        family: {
          name: 'The Johnson Family',
          email: 'johnson.family@email.com',
          phone: '+1-217-555-0101'
        }
      });

      // Mock dashboard stats
      setStats({
        totalCourses: 3,
        totalServices: 2,
        currentMonthFee: 8500,
        outstandingDues: 0,
        academicLogs: 5,
        achievements: 2
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <img src='/logo.webp' alt='Rand Training College' className='h-10 w-auto mr-3' />
              <h1 className='text-2xl font-bold text-gray-900'>Rand Training College</h1>
              <span className='ml-4 px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm font-medium rounded-full'>
                🎓 Student Portal
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-600'>Welcome,</p>
                <p className='font-semibold text-gray-900'>
                  {studentProfile?.name}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <nav className='flex space-x-8'>
            {[
              { id: 'overview', name: 'Dashboard', icon: '📊' },
              { id: 'my-courses', name: 'My Courses', icon: '📚' },
              { id: 'my-fees', name: 'Fees & Payments', icon: '💰' },
              { id: 'assignments', name: 'Assignments & Notes', icon: '📋' },
              { id: 'academic-logs', name: 'Academic Progress', icon: '📝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className='mr-2'>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeTab === 'overview' && (
          <div className='space-y-8'>
            {/* Welcome Section */}
            <div className='bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-xl shadow-lg p-8 text-white'>
              <h2 className='text-3xl font-bold mb-4'>
                Welcome Back, {studentProfile?.name}!
              </h2>
              <p className='text-lg opacity-90 mb-6'>
                Track your academic progress, view course materials, and stay
                updated with your learning journey
              </p>
              <div className='flex flex-wrap gap-4'>
                <div className='bg-white bg-opacity-20 rounded-lg px-4 py-2'>
                  <span className='text-sm font-medium'>
                    {studentProfile?.grade}
                  </span>
                </div>
                <div className='bg-white bg-opacity-20 rounded-lg px-4 py-2'>
                  <span className='text-sm font-medium'>
                    {studentProfile?.studentId}
                  </span>
                </div>
                <div className='bg-white bg-opacity-20 rounded-lg px-4 py-2'>
                  <span className='text-sm font-medium'>
                    {studentProfile?.family.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Enrolled Courses
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalCourses}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Active subjects
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-lg'>
                    <span className='text-3xl'>📚</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Services
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalServices}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Active services
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-lg'>
                    <span className='text-3xl'>🚌</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Monthly Fee
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      ₹{stats.currentMonthFee.toLocaleString()}
                    </p>
                    <p className='text-sm text-orange-700 mt-1'>
                      Current month
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-lg'>
                    <span className='text-3xl'>💰</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Outstanding Dues
                    </p>
                    <p
                      className={`text-3xl font-bold ${stats.outstandingDues > 0 ? 'text-red-600' : 'text-orange-600'}`}
                    >
                      ₹{stats.outstandingDues.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm mt-1 ${stats.outstandingDues > 0 ? 'text-red-600' : 'text-orange-600'}`}
                    >
                      {stats.outstandingDues > 0
                        ? 'Payment pending'
                        : 'All clear!'}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${stats.outstandingDues > 0 ? 'bg-red-100' : 'bg-orange-100'}`}
                  >
                    <span className='text-3xl'>
                      {stats.outstandingDues > 0 ? '⚠️' : '✅'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Academic Logs
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.academicLogs}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Progress records
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-lg'>
                    <span className='text-3xl'>📝</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Achievements
                    </p>
                    <p className='text-3xl font-bold text-yellow-600'>
                      {stats.achievements}
                    </p>
                    <p className='text-sm text-yellow-600 mt-1'>
                      Earned this term
                    </p>
                  </div>
                  <div className='p-3 bg-yellow-100 rounded-lg'>
                    <span className='text-3xl'>🏆</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <button
                onClick={() => setActiveTab('my-courses')}
                className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-left group'
              >
                <div className='flex items-center'>
                  <div className='p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                    <span className='text-2xl'>📚</span>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      View My Courses
                    </h3>
                    <p className='text-gray-600'>
                      Access course materials and schedules
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('my-fees')}
                className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-left group'
              >
                <div className='flex items-center'>
                  <div className='p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                    <span className='text-2xl'>💰</span>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Check Fees & Payments
                    </h3>
                    <p className='text-gray-600'>
                      View fee structure and payment history
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('assignments')}
                className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-left group'
              >
                <div className='flex items-center'>
                  <div className='p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                    <span className='text-2xl'>📋</span>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Assignments & Notes
                    </h3>
                    <p className='text-gray-600'>
                      View homework, projects, and study materials
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('academic-logs')}
                className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-left group'
              >
                <div className='flex items-center'>
                  <div className='p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                    <span className='text-2xl'>📝</span>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Academic Progress
                    </h3>
                    <p className='text-gray-600'>
                      View progress reports and achievements
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Student Profile Summary */}
            {studentProfile && (
              <div className='bg-white rounded-xl border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Student Profile
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Student ID:</span>
                      <span className='font-medium'>
                        {studentProfile.studentId}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Grade:</span>
                      <span className='font-medium'>
                        {studentProfile.grade}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date of Birth:</span>
                      <span className='font-medium'>
                        {new Date(
                          studentProfile.dateOfBirth
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Family:</span>
                      <span className='font-medium'>
                        {studentProfile.family.name}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Enrollment Date:</span>
                      <span className='font-medium'>
                        {new Date(
                          studentProfile.enrollmentDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Contact:</span>
                      <span className='font-medium'>
                        {studentProfile.family.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-courses' && <MyCoursesView />}
        {activeTab === 'my-fees' && <MyFeesView />}
        {activeTab === 'assignments' && <AssignmentsView />}
        {activeTab === 'academic-logs' && <MyAcademicLogsView />}
      </main>
    </div>
  );
}
