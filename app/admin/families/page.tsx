'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import FamilyForm from '@/components/forms/FamilyForm';

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

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilies();
  }, []);

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
      } else {
        setError('Failed to fetch families');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (familyId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this family? This will also delete all associated students.'
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/families/${familyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFamilies(families.filter(family => family.id !== familyId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete family');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleFormSuccess = (family: Family) => {
    if (editingFamily) {
      setFamilies(families.map(f => (f.id === family.id ? family : f)));
    } else {
      setFamilies([family, ...families]);
    }
    setShowForm(false);
    setEditingFamily(null);
  };

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFamily(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading families...</div>
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
              Families
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Manage family records and discount settings
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className='btn-primary'>
            <span className='mr-2'>+</span>
            Add New Family
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
              {editingFamily ? 'Edit Family' : 'Add New Family'}
            </h3>
            <FamilyForm
              family={editingFamily}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className='table-container animate-slide-up'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='table-header'>Family Name</th>
                <th className='table-header'>Contact Info</th>
                <th className='table-header'>Students</th>
                <th className='table-header'>Family Discount</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {families.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='table-cell text-center text-gray-500'
                  >
                    No families found. Create your first family to get started.
                  </td>
                </tr>
              ) : (
                families.map(family => (
                  <tr
                    key={family.id}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='table-cell'>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {family.name}
                        </div>
                        {family.address && (
                          <div className='text-sm text-gray-500'>
                            {family.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='space-y-1'>
                        {family.phone && (
                          <div className='text-sm text-gray-900'>
                            {family.phone}
                          </div>
                        )}
                        {family.email && (
                          <div className='text-sm text-gray-500'>
                            {family.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='space-y-1'>
                        <div className='font-medium'>
                          {family._count.students} students
                        </div>
                        {family.students.slice(0, 2).map(student => (
                          <div
                            key={student.id}
                            className='text-sm text-gray-500'
                          >
                            {student.name}{' '}
                            {student.grade && `(${student.grade})`}
                          </div>
                        ))}
                        {family.students.length > 2 && (
                          <div className='text-sm text-gray-400'>
                            +{family.students.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='table-cell'>
                      {family.discountAmount > 0 ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                          ₹{family.discountAmount}
                        </span>
                      ) : (
                        <span className='text-gray-400'>No discount</span>
                      )}
                    </td>
                    <td className='table-cell'>
                      <div className='flex space-x-3'>
                        <button
                          onClick={() => handleEdit(family)}
                          className='bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(family.id)}
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
