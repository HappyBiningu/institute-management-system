'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import CourseForm from '@/components/forms/CourseForm';

interface Course {
  id: string;
  name: string;
  description?: string;
  grade?: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
  feeStructure?: {
    id: string;
    amount: number;
    billingCycle: string;
  };
  _count: {
    subscriptions: number;
  };
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete course');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleFormSuccess = (course: Course) => {
    if (editingCourse) {
      setCourses(courses.map(c => (c.id === course.id ? course : c)));
    } else {
      setCourses([course, ...courses]);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading courses...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div className='flex justify-between items-center animate-fade-in'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              Courses
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Manage course offerings and fee structures
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className='btn-primary'>
            <span className='mr-2'>+</span>
            Add New Course
          </button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl animate-fade-in'>
            <div className='flex items-center'>
              <span className='text-red-500 mr-2'>⚠️</span>
              {error}
            </div>
          </div>
        )}

        {showForm && (
          <div className='card animate-slide-up'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h3>
            <CourseForm
              course={editingCourse}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className='table-container'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='table-header'>Course Name</th>
                <th className='table-header'>Grade</th>
                <th className='table-header'>Teacher</th>
                <th className='table-header'>Fee Structure</th>
                <th className='table-header'>Students</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='table-cell text-center text-gray-500'
                  >
                    No courses found. Create your first course to get started.
                  </td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course.id}>
                    <td className='table-cell'>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {course.name}
                        </div>
                        {course.description && (
                          <div className='text-sm text-gray-500'>
                            {course.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='table-cell'>{course.grade || '-'}</td>
                    <td className='table-cell'>
                      {course.teacher ? course.teacher.name : 'Not assigned'}
                    </td>
                    <td className='table-cell'>
                      {course.feeStructure ? (
                        <div>
                          <div className='font-medium'>
                            ₹{course.feeStructure.amount}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {course.feeStructure.billingCycle}
                          </div>
                        </div>
                      ) : (
                        <span className='text-gray-500'>Not set</span>
                      )}
                    </td>
                    <td className='table-cell'>
                      {course._count.subscriptions}
                    </td>
                    <td className='table-cell'>
                      <div className='flex space-x-3'>
                        <button
                          onClick={() => handleEdit(course)}
                          className='bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className='bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={course._count.subscriptions > 0}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
