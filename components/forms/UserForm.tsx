'use client';

import { useState, useEffect } from 'react';

interface Family {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  familyId?: string;
  family?: Family;
  isActive: boolean;
  createdAt: string;
}

interface UserFormProps {
  user?: User | null;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PARENT',
    familyId: '',
    isActive: true
  });
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilies();

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't populate password for editing
        role: user.role,
        familyId: user.familyId || '',
        isActive: user.isActive
      });
    }
  }, [user]);

  const fetchFamilies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/families', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFamilies(data);
      }
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = user ? `/api/users/${user.id}` : '/api/users';
      const method = user ? 'PUT' : 'POST';

      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        familyId: formData.familyId || null,
        isActive: formData.isActive
      };

      // Only include password for new users or when explicitly provided
      if (!user || formData.password) {
        payload.password = formData.password;
      }

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
        setError(data.error || 'Failed to save user');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl'>
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

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Full Name *
          </label>
          <input
            type='text'
            name='name'
            id='name'
            required
            className='input-field'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., John Smith'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Email Address *
          </label>
          <input
            type='email'
            name='email'
            id='email'
            required
            className='input-field'
            value={formData.email}
            onChange={handleChange}
            placeholder='e.g., john@example.com'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Password {user ? '(Leave blank to keep current)' : '*'}
          </label>
          <input
            type='password'
            name='password'
            id='password'
            required={!user}
            className='input-field'
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter password'
          />
        </div>

        <div>
          <label
            htmlFor='role'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Role *
          </label>
          <select
            name='role'
            id='role'
            required
            className='input-field'
            value={formData.role}
            onChange={handleChange}
          >
            <option value='ADMIN'>Administrator</option>
            <option value='TEACHER'>Teacher</option>
            <option value='PARENT'>Parent</option>
            <option value='STUDENT'>Student</option>
          </select>
        </div>
      </div>

      {(formData.role === 'PARENT' || formData.role === 'STUDENT') && (
        <div>
          <label
            htmlFor='familyId'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Family {formData.role === 'PARENT' ? '*' : ''}
          </label>
          <select
            name='familyId'
            id='familyId'
            required={formData.role === 'PARENT'}
            className='input-field'
            value={formData.familyId}
            onChange={handleChange}
          >
            <option value=''>Select a family</option>
            {families.map(family => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>
          {families.length === 0 && (
            <p className='mt-2 text-sm text-gray-500'>
              No families found. Please create a family first.
            </p>
          )}
        </div>
      )}

      <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200'>
        <h4 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
          <span className='w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mr-3'>
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
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </span>
          Account Status
        </h4>

        <div className='flex items-center'>
          <input
            type='checkbox'
            name='isActive'
            id='isActive'
            checked={formData.isActive}
            onChange={handleChange}
            className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded'
          />
          <label
            htmlFor='isActive'
            className='ml-3 text-sm font-medium text-gray-900'
          >
            Account is active
          </label>
        </div>
        <p className='mt-2 text-sm text-gray-600'>
          Inactive users cannot log in to the system.
        </p>
      </div>

      <div className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200'>
        <h4 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
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
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </span>
          Role Permissions
        </h4>

        <div className='text-sm text-gray-600'>
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
            <div>
              <strong>Administrator:</strong> Full system access
            </div>
            <div>
              <strong>Teacher:</strong> Course and student management
            </div>
            <div>
              <strong>Parent:</strong> View family information and payments
            </div>
            <div>
              <strong>Student:</strong> View personal information and courses
            </div>
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
          ) : user ? (
            'Update User'
          ) : (
            'Create User'
          )}
        </button>
      </div>
    </form>
  );
}
