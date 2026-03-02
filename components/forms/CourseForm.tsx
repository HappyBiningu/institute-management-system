'use client';

import { useState, useEffect } from 'react';

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  description?: string;
  grade?: string;
  teacher?: Teacher;
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

interface CourseFormProps {
  course?: Course | null;
  onSuccess: (course: Course) => void;
  onCancel: () => void;
}

export default function CourseForm({
  course,
  onSuccess,
  onCancel
}: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grade: '',
    teacherId: '',
    feeAmount: '',
    billingCycle: 'MONTHLY'
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();

    if (course) {
      setFormData({
        name: course.name,
        description: course.description || '',
        grade: course.grade || '',
        teacherId: course.teacher?.id || '',
        feeAmount: course.feeStructure?.amount?.toString() || '',
        billingCycle: course.feeStructure?.billingCycle || 'MONTHLY'
      });
    }
  }, [course]);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users?role=TEACHER', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = course ? `/api/courses/${course.id}` : '/api/courses';
      const method = course ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        description: formData.description || null,
        grade: formData.grade || null,
        teacherId: formData.teacherId || null,
        feeStructure: formData.feeAmount
          ? {
              amount: formData.feeAmount,
              billingCycle: formData.billingCycle
            }
          : null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save course');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl'>
          <div className='flex items-center'>
            <span className='text-red-500 mr-2'>⚠️</span>
            {error}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Course Name *
          </label>
          <input
            type='text'
            name='name'
            id='name'
            required
            className='input-field'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., Mathematics Grade 10'
          />
        </div>

        <div>
          <label
            htmlFor='grade'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Grade/Level
          </label>
          <input
            type='text'
            name='grade'
            id='grade'
            className='input-field'
            value={formData.grade}
            onChange={handleChange}
            placeholder='e.g., Grade 10, Beginner'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='description'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Description
        </label>
        <textarea
          name='description'
          id='description'
          rows={4}
          className='input-field resize-none'
          value={formData.description}
          onChange={handleChange}
          placeholder='Brief description of the course'
        />
      </div>

      <div>
        <label
          htmlFor='teacherId'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Assigned Teacher
        </label>
        <select
          name='teacherId'
          id='teacherId'
          className='input-field'
          value={formData.teacherId}
          onChange={handleChange}
        >
          <option value=''>Select a teacher (optional)</option>
          {Array.isArray(teachers) &&
            teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} ({teacher.email})
              </option>
            ))}
        </select>
      </div>

      <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200'>
        <h4 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <span className='w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
              />
            </svg>
          </span>
          Fee Structure
        </h4>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='feeAmount'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Fee Amount (₹)
            </label>
            <input
              type='number'
              name='feeAmount'
              id='feeAmount'
              min='0'
              step='0.01'
              className='input-field'
              value={formData.feeAmount}
              onChange={handleChange}
              placeholder='0.00'
            />
          </div>

          <div>
            <label
              htmlFor='billingCycle'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Billing Cycle
            </label>
            <select
              name='billingCycle'
              id='billingCycle'
              className='input-field'
              value={formData.billingCycle}
              onChange={handleChange}
            >
              <option value='MONTHLY'>Monthly</option>
              <option value='QUARTERLY'>Quarterly</option>
              <option value='HALF_YEARLY'>Half Yearly</option>
              <option value='YEARLY'>Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <div className='flex justify-end space-x-4 pt-6'>
        <button
          type='button'
          onClick={onCancel}
          className='btn-secondary'
          disabled={loading}
        >
          Cancel
        </button>
        <button type='submit' className='btn-primary' disabled={loading}>
          {loading ? (
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              Saving...
            </div>
          ) : course ? (
            'Update Course'
          ) : (
            'Create Course'
          )}
        </button>
      </div>
    </form>
  );
}
