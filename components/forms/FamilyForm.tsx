'use client';

import { useState, useEffect } from 'react';

interface Family {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  discountAmount: number;
  students: {
    id: string;
    name: string;
    grade?: string;
  }[];
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  _count: {
    students: number;
    users: number;
  };
  createdAt: string;
}

interface FamilyFormProps {
  family?: Family | null;
  onSuccess: (family: Family) => void;
  onCancel: () => void;
}

export default function FamilyForm({
  family,
  onSuccess,
  onCancel
}: FamilyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    discountAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (family) {
      setFormData({
        name: family.name,
        address: family.address || '',
        phone: family.phone || '',
        email: family.email || '',
        discountAmount: family.discountAmount?.toString() || ''
      });
    }
  }, [family]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = family ? `/api/families/${family.id}` : '/api/families';
      const method = family ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null,
        discountAmount: formData.discountAmount || null
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
        setError(data.error || 'Failed to save family');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        <div className='sm:col-span-2'>
          <label
            htmlFor='name'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Family Name *
          </label>
          <input
            type='text'
            name='name'
            id='name'
            required
            className='input-field'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., The Smith Family'
          />
        </div>

        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Phone Number
          </label>
          <input
            type='tel'
            name='phone'
            id='phone'
            className='input-field'
            value={formData.phone}
            onChange={handleChange}
            placeholder='e.g., +1234567890'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Email Address
          </label>
          <input
            type='email'
            name='email'
            id='email'
            className='input-field'
            value={formData.email}
            onChange={handleChange}
            placeholder='e.g., family@example.com'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='address'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Address
        </label>
        <textarea
          name='address'
          id='address'
          rows={3}
          className='input-field resize-none'
          value={formData.address}
          onChange={handleChange}
          placeholder='Full address including city and postal code'
        />
      </div>

      <div className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200'>
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
          Family Discount
        </h4>

        <div>
          <label
            htmlFor='discountAmount'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Monthly Discount Amount (₹)
          </label>
          <input
            type='number'
            name='discountAmount'
            id='discountAmount'
            min='0'
            step='0.01'
            className='input-field'
            value={formData.discountAmount}
            onChange={handleChange}
            placeholder='0.00'
          />
          <p className='mt-2 text-sm text-gray-600'>
            This discount will be proportionally distributed among all children
            in the family.
          </p>
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
          ) : family ? (
            'Update Family'
          ) : (
            'Create Family'
          )}
        </button>
      </div>
    </form>
  );
}
