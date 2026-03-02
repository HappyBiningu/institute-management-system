'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import UserForm from '@/components/forms/UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  familyId?: string;
  family?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user status');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleFormSuccess = (user: User) => {
    if (editingUser) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      setUsers([user, ...users]);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'TEACHER':
        return 'bg-orange-100 text-orange-800';
      case 'PARENT':
        return 'bg-orange-100 text-orange-800';
      case 'STUDENT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading users...</div>
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
              Users
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Manage system users and access permissions
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className='btn-primary'>
            <span className='mr-2'>+</span>
            Add New User
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
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <UserForm
              user={editingUser}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className='table-container animate-slide-up'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='table-header'>Name</th>
                <th className='table-header'>Email</th>
                <th className='table-header'>Role</th>
                <th className='table-header'>Family</th>
                <th className='table-header'>Status</th>
                <th className='table-header'>Created</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='table-cell text-center text-gray-500'
                  >
                    No users found. Create your first user to get started.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='table-cell'>
                      <div className='font-medium text-gray-900'>
                        {user.name}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='text-gray-900'>{user.email}</div>
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className='table-cell'>
                      {user.family ? (
                        <div className='text-gray-900'>{user.family.name}</div>
                      ) : (
                        <span className='text-gray-400'>-</span>
                      )}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='table-cell'>
                      <div className='text-sm text-gray-900'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleEdit(user)}
                          className='bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-medium transition-colors duration-200'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                            user.isActive
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                              : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs font-medium transition-colors duration-200'
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
