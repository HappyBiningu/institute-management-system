'use client';

import { useState, useEffect } from 'react';

interface AcademicLog {
  id: string;
  title: string;
  content: string;
  logType: 'ACHIEVEMENT' | 'PROGRESS' | 'CONCERN';
  subject: string;
  isPrivate: boolean;
  createdAt: string;
  teacher: {
    name: string;
  };
}

export default function MyAcademicLogsView() {
  const [academicLogs, setAcademicLogs] = useState<AcademicLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    // Mock data for student's academic logs
    setAcademicLogs([
      {
        id: '1',
        title: 'Outstanding Performance in Advanced Mathematics',
        content:
          'Emma has consistently scored above 95% in all calculus assessments and shows exceptional problem-solving skills. Her understanding of complex mathematical concepts is remarkable for her grade level.',
        logType: 'ACHIEVEMENT',
        subject: 'Mathematics',
        isPrivate: false,
        createdAt: '2024-06-15T10:30:00Z',
        teacher: { name: 'Dr. Sarah Johnson' }
      },
      {
        id: '2',
        title: 'Excellent Research Project on Renewable Energy',
        content:
          'Emma submitted an outstanding research project on solar energy efficiency that exceeded grade-level expectations. The project demonstrated thorough research, critical thinking, and innovative solutions.',
        logType: 'ACHIEVEMENT',
        subject: 'Physics',
        isPrivate: false,
        createdAt: '2024-06-10T14:20:00Z',
        teacher: { name: 'Prof. Michael Chen' }
      },
      {
        id: '3',
        title: 'Regular Progress Update - Mathematics',
        content:
          'Emma continues to excel in advanced mathematics. She has mastered differential calculus and is ready to move on to integral calculus. Her homework completion rate is 100%.',
        logType: 'PROGRESS',
        subject: 'Mathematics',
        isPrivate: false,
        createdAt: '2024-06-05T09:15:00Z',
        teacher: { name: 'Dr. Sarah Johnson' }
      },
      {
        id: '4',
        title: 'Creative Writing Excellence',
        content:
          "Emma's latest essay on contemporary literature shows sophisticated analysis and excellent writing skills. Her ability to connect themes across different works is impressive.",
        logType: 'ACHIEVEMENT',
        subject: 'English Literature',
        isPrivate: false,
        createdAt: '2024-05-28T11:45:00Z',
        teacher: { name: 'System Administrator' }
      },
      {
        id: '5',
        title: 'Physics Lab Performance',
        content:
          'Emma demonstrates strong practical skills in physics laboratory sessions. Her experimental technique and data analysis are consistently accurate.',
        logType: 'PROGRESS',
        subject: 'Physics',
        isPrivate: false,
        createdAt: '2024-05-20T16:30:00Z',
        teacher: { name: 'Prof. Michael Chen' }
      }
    ]);

    setLoading(false);
  }, []);

  const getLogTypeIcon = (logType: string) => {
    switch (logType) {
      case 'ACHIEVEMENT':
        return '🏆';
      case 'CONCERN':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getLogTypeColor = (logType: string) => {
    switch (logType) {
      case 'ACHIEVEMENT':
        return 'bg-orange-100 text-orange-800';
      case 'CONCERN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const filteredLogs = academicLogs.filter(log => {
    const matchesType = filterType === 'all' || log.logType === filterType;
    const matchesSubject =
      filterSubject === 'all' || log.subject === filterSubject;
    return matchesType && matchesSubject && !log.isPrivate; // Only show non-private logs to students
  });

  const uniqueSubjects = Array.from(
    new Set(academicLogs.map(log => log.subject))
  );
  const achievementCount = academicLogs.filter(
    log => log.logType === 'ACHIEVEMENT'
  ).length;
  const progressCount = academicLogs.filter(
    log => log.logType === 'PROGRESS'
  ).length;

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>Academic Progress</h2>
        <p className='text-gray-600 mt-1'>
          Track your academic achievements and progress reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Achievements
              </p>
              <p className='text-3xl font-bold text-orange-600'>
                {achievementCount}
              </p>
              <p className='text-sm text-gray-500 mt-1'>This academic year</p>
            </div>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <span className='text-3xl'>🏆</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Progress Reports
              </p>
              <p className='text-3xl font-bold text-orange-600'>
                {progressCount}
              </p>
              <p className='text-sm text-gray-500 mt-1'>Regular updates</p>
            </div>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <span className='text-3xl'>📊</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Subjects Tracked
              </p>
              <p className='text-3xl font-bold text-orange-700'>
                {uniqueSubjects.length}
              </p>
              <p className='text-sm text-gray-500 mt-1'>Active monitoring</p>
            </div>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <span className='text-3xl'>📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            >
              <option value='all'>All Types</option>
              <option value='ACHIEVEMENT'>Achievements</option>
              <option value='PROGRESS'>Progress Reports</option>
              <option value='CONCERN'>Areas of Concern</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Subject
            </label>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            >
              <option value='all'>All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Academic Logs */}
      <div className='space-y-4'>
        {filteredLogs.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>📝</span>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No Academic Logs Found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your filters or check back later for updates.
            </p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <span className='text-2xl'>
                      {getLogTypeIcon(log.logType)}
                    </span>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {log.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getLogTypeColor(log.logType)}`}
                    >
                      {log.logType}
                    </span>
                  </div>
                  <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                    <span>
                      <strong>Subject:</strong> {log.subject}
                    </span>
                    <span>
                      <strong>Teacher:</strong> {log.teacher.name}
                    </span>
                  </div>
                </div>
                <span className='text-sm text-gray-500'>
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-gray-700 leading-relaxed'>{log.content}</p>
              </div>

              {log.logType === 'ACHIEVEMENT' && (
                <div className='mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-orange-600'>🎉</span>
                    <span className='text-sm font-medium text-orange-800'>
                      Congratulations on this achievement! Keep up the excellent
                      work.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Academic Performance Summary */}
      <div className='bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl border border-orange-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          🎯 Academic Performance Summary
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='font-medium text-gray-900 mb-3'>Strengths</h4>
            <ul className='space-y-2 text-sm text-gray-700'>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Exceptional performance in Mathematics</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Strong research and analytical skills</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Consistent homework completion</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Excellent laboratory technique</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-medium text-gray-900 mb-3'>Areas for Growth</h4>
            <ul className='space-y-2 text-sm text-gray-700'>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>→</span>
                <span>Continue developing creative writing skills</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>→</span>
                <span>Explore advanced physics concepts</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>→</span>
                <span>Participate in more group discussions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
