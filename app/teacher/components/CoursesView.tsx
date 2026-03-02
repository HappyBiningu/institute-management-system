'use client';

import { useState, useEffect } from 'react';

interface Course {
  id: string;
  name: string;
  description: string;
  grade: string;
  capacity: number;
  isActive: boolean;
  teacher: {
    id: string;
    name: string;
  };
  subscriptions: {
    id: string;
    student: {
      id: string;
      name: string;
      grade: string;
      studentId: string;
      family: {
        name: string;
      };
    };
  }[];
  feeStructure?: {
    amount: number;
    billingCycle: string;
  };
}

export default function CoursesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const coursesData = await response.json();
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses taught by current teacher
  const myCourses = courses.filter(
    course => course.teacher?.id === currentUser?.id
  );

  const getEnrollmentPercentage = (course: Course) => {
    return Math.round((course.subscriptions.length / course.capacity) * 100);
  };

  const getEnrollmentColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>My Courses</h2>
        <p className='text-gray-600 mt-1'>
          Manage your courses and view student enrollments
        </p>
      </div>

      {/* Courses Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {myCourses.map(course => {
          const enrollmentPercentage = getEnrollmentPercentage(course);
          return (
            <div
              key={course.id}
              className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer'
              onClick={() => setSelectedCourse(course)}
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    {course.name}
                  </h3>
                  <p className='text-sm text-gray-600 mb-2'>{course.grade}</p>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      course.isActive
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.isActive ? '✅ Active' : '⏸️ Inactive'}
                  </div>
                </div>
                <div className='text-right'>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEnrollmentColor(enrollmentPercentage)}`}
                  >
                    {enrollmentPercentage}% Full
                  </div>
                </div>
              </div>

              <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                {course.description}
              </p>

              <div className='space-y-3'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Enrolled Students:</span>
                  <span className='font-medium'>
                    {course.subscriptions.length} / {course.capacity}
                  </span>
                </div>

                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all ${
                      enrollmentPercentage >= 90
                        ? 'bg-red-500'
                        : enrollmentPercentage >= 70
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                    }`}
                    style={{ width: `${enrollmentPercentage}%` }}
                  ></div>
                </div>

                {course.feeStructure && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600'>Fee:</span>
                    <span className='font-medium'>
                      ₹{course.feeStructure.amount.toLocaleString()}/
                      {course.feeStructure.billingCycle.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>
                    Click to view details
                  </span>
                  <svg
                    className='w-4 h-4 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {myCourses.length === 0 && (
        <div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>📚</span>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No Courses Assigned
          </h3>
          <p className='text-gray-600'>
            You haven&apos;t been assigned to teach any courses yet.
          </p>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h3 className='text-2xl font-bold text-gray-900'>
                  {selectedCourse.name}
                </h3>
                <p className='text-gray-600'>
                  {selectedCourse.grade} • {selectedCourse.subscriptions.length}{' '}
                  students enrolled
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
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
              {/* Course Information */}
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Course Details
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-gray-700'>
                      {selectedCourse.description}
                    </p>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Grade Level:</span>
                        <span className='font-medium'>
                          {selectedCourse.grade}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Capacity:</span>
                        <span className='font-medium'>
                          {selectedCourse.capacity} students
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>
                          Current Enrollment:
                        </span>
                        <span className='font-medium'>
                          {selectedCourse.subscriptions.length} students
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Status:</span>
                        <span
                          className={
                            selectedCourse.isActive
                              ? 'text-orange-600'
                              : 'text-red-600'
                          }
                        >
                          {selectedCourse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {selectedCourse.feeStructure && (
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Fee Structure:</span>
                          <span className='font-medium'>
                            ₹
                            {selectedCourse.feeStructure.amount.toLocaleString()}
                            /
                            {selectedCourse.feeStructure.billingCycle.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Enrollment Statistics
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-600'>
                        Enrollment Rate:
                      </span>
                      <span className='text-lg font-bold text-gray-900'>
                        {getEnrollmentPercentage(selectedCourse)}%
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-3'>
                      <div
                        className={`h-3 rounded-full transition-all ${
                          getEnrollmentPercentage(selectedCourse) >= 90
                            ? 'bg-red-500'
                            : getEnrollmentPercentage(selectedCourse) >= 70
                              ? 'bg-yellow-500'
                              : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${getEnrollmentPercentage(selectedCourse)}%`
                        }}
                      ></div>
                    </div>
                    <div className='flex justify-between text-xs text-gray-500'>
                      <span>0</span>
                      <span>{selectedCourse.capacity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrolled Students */}
              <div>
                <h4 className='font-semibold text-gray-900 mb-3'>
                  Enrolled Students
                </h4>
                <div className='space-y-3 max-h-96 overflow-y-auto'>
                  {selectedCourse.subscriptions.length > 0 ? (
                    selectedCourse.subscriptions.map(subscription => (
                      <div
                        key={subscription.id}
                        className='bg-gray-50 rounded-lg p-3'
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                            {subscription.student.name.charAt(0)}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between'>
                              <span className='font-medium text-gray-900'>
                                {subscription.student.name}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {subscription.student.studentId}
                              </span>
                            </div>
                            <div className='flex items-center justify-between text-sm text-gray-600'>
                              <span>{subscription.student.grade}</span>
                              <span>{subscription.student.family.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      <span className='text-2xl block mb-2'>👨‍🎓</span>
                      No students enrolled yet
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
