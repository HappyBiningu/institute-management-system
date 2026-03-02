'use client';

import { useState } from 'react';
import StatCard from '../../../components/shared/StatCard';
import EmptyState from '../../../components/shared/EmptyState';

interface Child {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  dateOfBirth: string;
  enrollmentDate: string;
  isActive: boolean;
  courses: {
    name: string;
    teacher: string;
    grade: string;
  }[];
  services: {
    name: string;
    description: string;
  }[];
  recentAchievements: {
    title: string;
    subject: string;
    date: string;
  }[];
}

interface ChildrenViewProps {
  selectedChild: string;
}

export default function ChildrenView({ selectedChild }: ChildrenViewProps) {
  const [selectedChildDetail, setSelectedChildDetail] = useState<Child | null>(
    null
  );

  // Mock data for children - in real implementation, fetch from API
  const children: Child[] = [
    {
      id: 'student-1',
      name: 'Emma Johnson',
      grade: 'Grade 11',
      studentId: 'STU001',
      dateOfBirth: '2007-03-12',
      enrollmentDate: '2023-08-15',
      isActive: true,
      courses: [
        {
          name: 'Advanced Mathematics',
          teacher: 'Dr. Sarah Johnson',
          grade: 'Grade 11-12'
        },
        {
          name: 'Physics',
          teacher: 'Prof. Michael Chen',
          grade: 'Grade 11-12'
        },
        {
          name: 'English Literature',
          teacher: 'System Administrator',
          grade: 'Grade 9-12'
        }
      ],
      services: [
        { name: 'Bus Transportation', description: 'Daily school bus service' },
        {
          name: 'Library Access',
          description: 'Extended library hours and digital resources'
        }
      ],
      recentAchievements: [
        {
          title: 'Outstanding Performance in Advanced Mathematics',
          subject: 'Mathematics',
          date: '2024-06-15'
        },
        {
          title: 'Excellent Research Project on Renewable Energy',
          subject: 'Physics',
          date: '2024-06-10'
        }
      ]
    },
    {
      id: 'student-2',
      name: 'Liam Johnson',
      grade: 'Grade 9',
      studentId: 'STU002',
      dateOfBirth: '2009-07-22',
      enrollmentDate: '2023-08-15',
      isActive: true,
      courses: [
        {
          name: 'Foundation Mathematics',
          teacher: 'Dr. Sarah Johnson',
          grade: 'Grade 8-10'
        },
        {
          name: 'English Literature',
          teacher: 'System Administrator',
          grade: 'Grade 9-12'
        },
        {
          name: 'Art & Design',
          teacher: 'Dr. Sarah Johnson',
          grade: 'Grade 8-12'
        }
      ],
      services: [
        { name: 'Bus Transportation', description: 'Daily school bus service' },
        { name: 'Lunch Service', description: 'Nutritious daily lunch meals' },
        {
          name: 'Sports Program',
          description: 'After-school sports and physical activities'
        }
      ],
      recentAchievements: [
        {
          title: 'Creative Excellence in Art Class',
          subject: 'Art',
          date: '2024-06-12'
        }
      ]
    }
  ];

  const filteredChildren =
    selectedChild === 'all'
      ? children
      : children.filter(child => child.id === selectedChild);

  if (filteredChildren.length === 0) {
    return (
      <EmptyState
        icon='👨‍🎓'
        title='No Children Found'
        description='No children match the selected criteria.'
      />
    );
  }

  return (
    <div className='space-y-8'>
      {/* Children Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredChildren.map(child => (
          <div
            key={child.id}
            className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer'
            onClick={() => setSelectedChildDetail(child)}
          >
            <div className='flex items-center space-x-4 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                {child.name.charAt(0)}
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900'>{child.name}</h3>
                <p className='text-sm text-gray-600'>{child.studentId}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${child.isActive ? 'bg-orange-400' : 'bg-gray-400'}`}
              ></div>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Grade:</span>
                <span className='font-medium'>{child.grade}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Courses:</span>
                <span className='font-medium'>{child.courses.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Services:</span>
                <span className='font-medium'>{child.services.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Achievements:</span>
                <span className='font-medium text-orange-600'>
                  {child.recentAchievements.length}
                </span>
              </div>
            </div>

            {/* Recent Achievement */}
            {child.recentAchievements.length > 0 && (
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <p className='text-xs text-gray-600 mb-2'>
                  Latest Achievement:
                </p>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg'>🏆</span>
                  <span className='text-xs font-medium text-orange-600'>
                    {child.recentAchievements[0].subject}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {new Date(
                      child.recentAchievements[0].date
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Child Detail Modal */}
      {selectedChildDetail && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h3 className='text-2xl font-bold text-gray-900'>
                  {selectedChildDetail.name}
                </h3>
                <p className='text-gray-600'>
                  {selectedChildDetail.studentId} • {selectedChildDetail.grade}
                </p>
              </div>
              <button
                onClick={() => setSelectedChildDetail(null)}
                className='text-gray-400 hover:text-gray-600'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Student Information */}
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Student Information
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date of Birth:</span>
                      <span>
                        {new Date(
                          selectedChildDetail.dateOfBirth
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Enrollment Date:</span>
                      <span>
                        {new Date(
                          selectedChildDetail.enrollmentDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Status:</span>
                      <span
                        className={
                          selectedChildDetail.isActive
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }
                      >
                        {selectedChildDetail.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Enrolled Courses
                  </h4>
                  <div className='space-y-2'>
                    {selectedChildDetail.courses.map((course, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between text-sm'
                      >
                        <div>
                          <span className='text-gray-700 font-medium'>
                            {course.name}
                          </span>
                          <div className='text-xs text-gray-500'>
                            {course.teacher}
                          </div>
                        </div>
                        <span className='text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded'>
                          {course.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Subscribed Services
                  </h4>
                  <div className='space-y-2'>
                    {selectedChildDetail.services.map((service, index) => (
                      <div key={index} className='text-sm'>
                        <span className='text-gray-700 font-medium'>
                          {service.name}
                        </span>
                        <div className='text-xs text-gray-500'>
                          {service.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className='font-semibold text-gray-900 mb-3'>
                  Recent Achievements
                </h4>
                <div className='space-y-3 max-h-96 overflow-y-auto'>
                  {selectedChildDetail.recentAchievements.length > 0 ? (
                    selectedChildDetail.recentAchievements.map(
                      (achievement, index) => (
                        <div key={index} className='bg-orange-50 rounded-lg p-3'>
                          <div className='flex items-center space-x-2 mb-2'>
                            <span className='text-lg'>🏆</span>
                            <span className='font-medium text-gray-900'>
                              {achievement.title}
                            </span>
                          </div>
                          <div className='flex items-center justify-between text-xs text-gray-600'>
                            <span>{achievement.subject}</span>
                            <span>
                              {new Date(achievement.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      <span className='text-2xl block mb-2'>🏆</span>
                      No achievements yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
