'use client';

import { useState } from 'react';
import StatCard from '../../../components/shared/StatCard';
import EmptyState from '../../../components/shared/EmptyState';

interface AcademicLog {
  id: string;
  studentName: string;
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

interface FamilyAcademicViewProps {
  selectedChild: string;
}

export default function FamilyAcademicView({
  selectedChild
}: FamilyAcademicViewProps) {
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Mock data for family academic logs - in real implementation, fetch from API
  const academicLogs: AcademicLog[] = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      title: 'Outstanding Performance in Advanced Mathematics',
      content:
        'Emma has consistently scored above 95% in all calculus assessments and shows exceptional problem-solving skills.',
      logType: 'ACHIEVEMENT',
      subject: 'Mathematics',
      isPrivate: false,
      createdAt: '2024-06-15T10:30:00Z',
      teacher: { name: 'Dr. Sarah Johnson' }
    },
    {
      id: '2',
      studentName: 'Emma Johnson',
      title: 'Excellent Research Project on Renewable Energy',
      content:
        'Emma submitted an outstanding research project on solar energy efficiency that exceeded grade-level expectations.',
      logType: 'ACHIEVEMENT',
      subject: 'Physics',
      isPrivate: false,
      createdAt: '2024-06-10T14:20:00Z',
      teacher: { name: 'Prof. Michael Chen' }
    },
    {
      id: '3',
      studentName: 'Liam Johnson',
      title: 'Creative Excellence in Art Class',
      content:
        'Liam created a beautiful portfolio showcasing various artistic techniques. His creativity is remarkable.',
      logType: 'ACHIEVEMENT',
      subject: 'Art',
      isPrivate: false,
      createdAt: '2024-06-12T11:45:00Z',
      teacher: { name: 'Dr. Sarah Johnson' }
    },
    {
      id: '4',
      studentName: 'Emma Johnson',
      title: 'Regular Progress Update - Mathematics',
      content:
        'Emma continues to excel in advanced mathematics. She has mastered differential calculus and is ready to move on to integral calculus.',
      logType: 'PROGRESS',
      subject: 'Mathematics',
      isPrivate: false,
      createdAt: '2024-06-05T09:15:00Z',
      teacher: { name: 'Dr. Sarah Johnson' }
    },
    {
      id: '5',
      studentName: 'Liam Johnson',
      title: 'Improvement in English Writing',
      content:
        'Liam has shown significant improvement in his essay writing skills. His latest assignment demonstrated better structure and vocabulary.',
      logType: 'PROGRESS',
      subject: 'English Literature',
      isPrivate: false,
      createdAt: '2024-06-08T16:30:00Z',
      teacher: { name: 'System Administrator' }
    }
  ];

  // Filter data based on selected child
  const filteredLogs = academicLogs.filter(log => {
    const matchesChild =
      selectedChild === 'all' ||
      (selectedChild === 'student-1' && log.studentName.includes('Emma')) ||
      (selectedChild === 'student-2' && log.studentName.includes('Liam'));
    const matchesType = filterType === 'all' || log.logType === filterType;
    const matchesSubject =
      filterSubject === 'all' || log.subject === filterSubject;
    return matchesChild && matchesType && matchesSubject && !log.isPrivate;
  });

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

  const uniqueSubjects = Array.from(
    new Set(academicLogs.map(log => log.subject))
  );

  // Calculate statistics
  const emmaLogs = academicLogs.filter(log => log.studentName.includes('Emma'));
  const liamLogs = academicLogs.filter(log => log.studentName.includes('Liam'));
  const totalAchievements = academicLogs.filter(
    log => log.logType === 'ACHIEVEMENT'
  ).length;
  const totalProgress = academicLogs.filter(
    log => log.logType === 'PROGRESS'
  ).length;
  const totalConcerns = academicLogs.filter(
    log => log.logType === 'CONCERN'
  ).length;

  return (
    <div className='space-y-8'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Total Achievements'
          value={totalAchievements}
          subtitle='Family achievements'
          icon='🏆'
          color='green'
        />
        <StatCard
          title='Progress Reports'
          value={totalProgress}
          subtitle='Regular updates'
          icon='📊'
          color='blue'
        />
        <StatCard
          title='Areas of Concern'
          value={totalConcerns}
          subtitle={totalConcerns > 0 ? 'Need attention' : 'All good!'}
          icon={totalConcerns > 0 ? '⚠️' : '😊'}
          color={totalConcerns > 0 ? 'red' : 'green'}
        />
        <StatCard
          title='Subjects Tracked'
          value={uniqueSubjects.length}
          subtitle='Active monitoring'
          icon='📚'
          color='purple'
        />
      </div>

      {/* Child-specific Statistics */}
      {selectedChild === 'all' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              👩‍🎓 Emma Johnson Progress
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Logs:</span>
                <span className='font-medium'>{emmaLogs.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Achievements:</span>
                <span className='font-medium text-orange-600'>
                  {emmaLogs.filter(log => log.logType === 'ACHIEVEMENT').length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Progress Reports:</span>
                <span className='font-medium text-orange-600'>
                  {emmaLogs.filter(log => log.logType === 'PROGRESS').length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Latest Activity:</span>
                <span className='font-medium text-gray-900'>
                  {emmaLogs.length > 0
                    ? new Date(emmaLogs[0].createdAt).toLocaleDateString()
                    : 'No activity'}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              👨‍🎓 Liam Johnson Progress
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Logs:</span>
                <span className='font-medium'>{liamLogs.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Achievements:</span>
                <span className='font-medium text-orange-600'>
                  {liamLogs.filter(log => log.logType === 'ACHIEVEMENT').length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Progress Reports:</span>
                <span className='font-medium text-orange-600'>
                  {liamLogs.filter(log => log.logType === 'PROGRESS').length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Latest Activity:</span>
                <span className='font-medium text-gray-900'>
                  {liamLogs.length > 0
                    ? new Date(liamLogs[0].createdAt).toLocaleDateString()
                    : 'No activity'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <EmptyState
            icon='📝'
            title='No Academic Logs Found'
            description='Try adjusting your filters or check back later for updates.'
          />
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
                      <strong>Student:</strong> {log.studentName}
                    </span>
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
                      Congratulations to {log.studentName} on this achievement!
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Family Academic Summary */}
      <div className='bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl border border-orange-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          🎯 Family Academic Summary
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='font-medium text-gray-900 mb-3'>Family Strengths</h4>
            <ul className='space-y-2 text-sm text-gray-700'>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Exceptional performance in Mathematics (Emma)</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Strong research and analytical skills (Emma)</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Creative excellence in Arts (Liam)</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>✓</span>
                <span>Consistent improvement across subjects</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-medium text-gray-900 mb-3'>Areas for Growth</h4>
            <ul className='space-y-2 text-sm text-gray-700'>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>→</span>
                <span>Continue developing writing skills (Liam)</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>→</span>
                <span>Explore advanced physics concepts (Emma)</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-orange-500'>→</span>
                <span>Encourage more collaborative learning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
