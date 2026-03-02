'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StudentForm from '@/components/forms/StudentForm';

interface Student {
  id: string;
  name: string;
  grade?: string;
  dateOfBirth?: string;
  enrollmentDate: string;
  family: {
    id: string;
    name: string;
    discountAmount: number;
  };
  subscriptions: {
    id: string;
    course?: {
      id: string;
      name: string;
      feeStructure?: {
        amount: number;
        billingCycle: string;
      };
    };
    service?: {
      id: string;
      name: string;
      feeStructure?: {
        amount: number;
        billingCycle: string;
      };
    };
    discountAmount: number;
  }[];
  _count: {
    subscriptions: number;
  };
  createdAt: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        setError('Failed to fetch students');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setStudents(students.filter(student => student.id !== studentId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete student');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleFormSuccess = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => (s.id === student.id ? student : s)));
    } else {
      setStudents([student, ...students]);
    }
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading students...</div>
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
              Students
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Manage student records and enrollments
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className='btn-primary'>
            <span className='mr-2'>+</span>
            Add New Student
          </button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl animate-fade-in'>
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-red-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {showForm && (
          <div className='card animate-slide-up'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <StudentForm
              student={editingStudent}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className='table-container animate-slide-up'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='table-header'>Student Name</th>
                <th className='table-header'>Family</th>
                <th className='table-header'>Grade</th>
                <th className='table-header'>Subscriptions</th>
                <th className='table-header'>Enrollment Date</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='table-cell text-center text-gray-500'
                  >
                    No students found. Create your first student to get started.
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr
                    key={student.id}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='table-cell'>
                      <div className='font-medium text-gray-900'>
                        {student.name}
                      </div>
                      {student.dateOfBirth && (
                        <div className='text-sm text-gray-500'>
                          DOB:{' '}
                          {new Date(student.dateOfBirth).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className='table-cell'>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {student.family.name}
                        </div>
                        {student.family.discountAmount > 0 && (
                          <div className='text-sm text-orange-600'>
                            Family discount: ₹{student.family.discountAmount}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='table-cell'>{student.grade || '-'}</td>
                    <td className='table-cell'>
                      <div className='space-y-1'>
                        <div className='font-medium'>
                          {student._count.subscriptions} active
                        </div>
                        {student.subscriptions.slice(0, 2).map(sub => (
                          <div key={sub.id} className='text-sm text-gray-500'>
                            {sub.course?.name || sub.service?.name}
                          </div>
                        ))}
                        {student.subscriptions.length > 2 && (
                          <div className='text-sm text-gray-400'>
                            +{student.subscriptions.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='table-cell'>
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className='table-cell'>
                      <div className='flex space-x-3'>
                        <button
                          onClick={() => handleEdit(student)}
                          className='bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className='bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200'
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
