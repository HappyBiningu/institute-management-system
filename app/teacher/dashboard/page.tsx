'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AcademicLogsManager from '../components/AcademicLogsManager';
import StudentsView from '../components/StudentsView';
import CoursesView from '../components/CoursesView';
import AssignmentsManager from '../components/AssignmentsManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalLogs: number;
  achievements: number;
  concerns: number;
  progressReports: number;
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalLogs: 0,
    achievements: 0,
    concerns: 0,
    progressReports: 0
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
    if (parsedUser.role !== 'TEACHER') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch dashboard statistics
      const [studentsRes, coursesRes, logsRes] = await Promise.all([
        fetch('/api/students', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/academic-logs', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      let totalStudents = 0;
      let totalCourses = 0;
      let totalLogs = 0;
      let achievements = 0;
      let concerns = 0;
      let progressReports = 0;

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        totalStudents = studentsData.length;
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        totalCourses = coursesData.length;
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        totalLogs = logsData.length;
        achievements = logsData.filter(
          (log: any) => log.logType === 'ACHIEVEMENT'
        ).length;
        concerns = logsData.filter(
          (log: any) => log.logType === 'CONCERN'
        ).length;
        progressReports = logsData.filter(
          (log: any) => log.logType === 'PROGRESS'
        ).length;
      }

      setStats({
        totalStudents,
        totalCourses,
        totalLogs,
        achievements,
        concerns,
        progressReports
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
                🎓 Teacher&apos;s Toolkit
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-600'>Welcome back,</p>
                <p className='font-semibold text-gray-900'>{user?.name}</p>
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
              { id: 'overview', name: 'Dashboard Overview', icon: '📊' },
              { id: 'assignments', name: 'Assignments & Notes', icon: '📋' },
              { id: 'academic-logs', name: 'Academic Logs', icon: '📝' },
              { id: 'my-students', name: 'My Students', icon: '👨‍🎓' },
              { id: 'my-courses', name: 'My Courses', icon: '📚' }
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
                Teacher&apos;s Dashboard
              </h2>
              <p className='text-lg opacity-90 mb-6'>
                Empower student success through comprehensive academic tracking
                and progress management
              </p>
              <div className='flex flex-wrap gap-4'>
                <div className='bg-white bg-opacity-20 rounded-lg px-4 py-2'>
                  <span className='text-sm font-medium'>
                    Academic Excellence
                  </span>
                </div>
                <div className='bg-white bg-opacity-20 rounded-lg px-4 py-2'>
                  <span className='text-sm font-medium'>Progress Tracking</span>
                </div>
                <div className='bg-white bg-opacity-20 rounded-lg px-4 py-2'>
                  <span className='text-sm font-medium'>
                    Student Development
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Students
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalStudents}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Active learners
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-lg'>
                    <span className='text-3xl'>👨‍🎓</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      My Courses
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalCourses}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Teaching subjects
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
                      Academic Logs
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalLogs}
                    </p>
                    <p className='text-sm text-orange-700 mt-1'>
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
                    <p className='text-3xl font-bold text-orange-600'>
                      {stats.achievements}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Student successes
                    </p>
                  </div>
                  <div className='p-3 bg-yellow-100 rounded-lg'>
                    <span className='text-3xl'>⭐</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Progress Reports
                    </p>
                    <p className='text-3xl font-bold text-orange-600'>
                      {stats.progressReports}
                    </p>
                    <p className='text-sm text-orange-600 mt-1'>
                      Regular updates
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-lg'>
                    <span className='text-3xl'>📊</span>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Concerns
                    </p>
                    <p className='text-3xl font-bold text-red-600'>
                      {stats.concerns}
                    </p>
                    <p className='text-sm text-red-600 mt-1'>Need attention</p>
                  </div>
                  <div className='p-3 bg-red-100 rounded-lg'>
                    <span className='text-3xl'>⚠️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                      Manage Assignments
                    </h3>
                    <p className='text-gray-600'>
                      Create homework, projects, and study materials
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
                      Manage Academic Logs
                    </h3>
                    <p className='text-gray-600'>
                      Create, view, and manage student progress records
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('my-students')}
                className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-left group'
              >
                <div className='flex items-center'>
                  <div className='p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                    <span className='text-2xl'>👥</span>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      View My Students
                    </h3>
                    <p className='text-gray-600'>
                      Access student information and academic history
                    </p>
                  </div>
                </div>
              </button>

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
                      Manage My Courses
                    </h3>
                    <p className='text-gray-600'>
                      View course details and student enrollments
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && <AssignmentsManager />}
        {activeTab === 'academic-logs' && <AcademicLogsManager />}
        {activeTab === 'my-students' && <StudentsView />}
        {activeTab === 'my-courses' && <CoursesView />}
      </main>
    </div>
  );
}
