'use client';

import { useState, useEffect } from 'react';

interface Course {
  id: string;
  name: string;
  description: string;
  grade: string;
  teacher: {
    name: string;
  };
  feeStructure?: {
    amount: number;
    billingCycle: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  feeStructure?: {
    amount: number;
    billingCycle: string;
  };
}

export default function MyCoursesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for student's enrolled courses and services
    // In a real implementation, this would fetch student-specific enrollments
    setCourses([
      {
        id: 'math-advanced',
        name: 'Advanced Mathematics',
        description:
          'Calculus, Statistics, and Advanced Algebra for high school students',
        grade: 'Grade 11-12',
        teacher: { name: 'Dr. Sarah Johnson' },
        feeStructure: { amount: 2500, billingCycle: 'MONTHLY' }
      },
      {
        id: 'science-physics',
        name: 'Physics',
        description: 'Mechanics, thermodynamics, and modern physics',
        grade: 'Grade 11-12',
        teacher: { name: 'Prof. Michael Chen' },
        feeStructure: { amount: 2800, billingCycle: 'MONTHLY' }
      },
      {
        id: 'english-literature',
        name: 'English Literature',
        description: 'Classic and modern literature analysis and writing',
        grade: 'Grade 9-12',
        teacher: { name: 'System Administrator' },
        feeStructure: { amount: 2200, billingCycle: 'MONTHLY' }
      }
    ]);

    setServices([
      {
        id: 'transport-bus',
        name: 'Bus Transportation',
        description: 'Daily school bus service with multiple routes',
        feeStructure: { amount: 1000, billingCycle: 'MONTHLY' }
      },
      {
        id: 'library-access',
        name: 'Library Access',
        description: 'Extended library hours and digital resources',
        feeStructure: { amount: 400, billingCycle: 'MONTHLY' }
      }
    ]);

    setLoading(false);
  }, []);

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
        <h2 className='text-2xl font-bold text-gray-900'>
          My Courses & Services
        </h2>
        <p className='text-gray-600 mt-1'>
          View your enrolled courses and subscribed services
        </p>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>
          📚 Enrolled Courses
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map(course => (
            <div
              key={course.id}
              className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    {course.name}
                  </h4>
                  <p className='text-sm text-gray-600 mb-2'>{course.grade}</p>
                  <div className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                    📚 Course
                  </div>
                </div>
              </div>

              <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                {course.description}
              </p>

              <div className='space-y-3'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Instructor:</span>
                  <span className='font-medium'>{course.teacher.name}</span>
                </div>

                {course.feeStructure && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600'>Fee:</span>
                    <span className='font-medium text-orange-600'>
                      ₹{course.feeStructure.amount.toLocaleString()}/
                      {course.feeStructure.billingCycle.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-orange-600 font-medium'>
                    ✅ Enrolled
                  </span>
                  <div className='flex space-x-2'>
                    <button className='text-xs text-orange-600 hover:text-orange-800 font-medium'>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribed Services */}
      <div>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>
          🚌 Subscribed Services
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {services.map(service => (
            <div
              key={service.id}
              className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    {service.name}
                  </h4>
                  <div className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                    🚌 Service
                  </div>
                </div>
              </div>

              <p className='text-sm text-gray-600 mb-4'>
                {service.description}
              </p>

              <div className='space-y-3'>
                {service.feeStructure && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600'>Fee:</span>
                    <span className='font-medium text-orange-600'>
                      ₹{service.feeStructure.amount.toLocaleString()}/
                      {service.feeStructure.billingCycle.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-orange-600 font-medium'>
                    ✅ Active
                  </span>
                  <div className='flex space-x-2'>
                    <button className='text-xs text-orange-600 hover:text-orange-800 font-medium'>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className='bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl border border-orange-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          📊 Enrollment Summary
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-600'>
              {courses.length}
            </div>
            <div className='text-sm text-gray-600'>Enrolled Courses</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-600'>
              {services.length}
            </div>
            <div className='text-sm text-gray-600'>Active Services</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-700'>
              ₹
              {(
                courses.reduce(
                  (sum, course) => sum + (course.feeStructure?.amount || 0),
                  0
                ) +
                services.reduce(
                  (sum, service) => sum + (service.feeStructure?.amount || 0),
                  0
                )
              ).toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Total Monthly Fee</div>
          </div>
        </div>
      </div>

      {/* Academic Calendar */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          📅 Academic Calendar
        </h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
              <span className='font-medium text-gray-900'>
                Mid-term Examinations
              </span>
            </div>
            <span className='text-sm text-gray-600'>March 15-22, 2024</span>
          </div>
          <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
              <span className='font-medium text-gray-900'>Spring Break</span>
            </div>
            <span className='text-sm text-gray-600'>April 1-7, 2024</span>
          </div>
          <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
              <span className='font-medium text-gray-900'>
                Final Examinations
              </span>
            </div>
            <span className='text-sm text-gray-600'>May 20-30, 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
