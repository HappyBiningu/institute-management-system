'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ServiceForm from '@/components/forms/ServiceForm';

interface Service {
  id: string;
  name: string;
  description?: string;
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setServices(services.filter(service => service.id !== serviceId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete service');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleFormSuccess = (service: Service) => {
    if (editingService) {
      setServices(services.map(s => (s.id === service.id ? service : s)));
    } else {
      setServices([service, ...services]);
    }
    setShowForm(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading services...</div>
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
              Services
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Manage additional services like transportation, meals, etc.
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className='btn-primary'>
            <span className='mr-2'>+</span>
            Add New Service
          </button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        )}

        {showForm && (
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <ServiceForm
              service={editingService}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className='table-container'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='table-header'>Service Name</th>
                <th className='table-header'>Description</th>
                <th className='table-header'>Fee Structure</th>
                <th className='table-header'>Students</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='table-cell text-center text-gray-500'
                  >
                    No services found. Create your first service to get started.
                  </td>
                </tr>
              ) : (
                services.map(service => (
                  <tr key={service.id}>
                    <td className='table-cell'>
                      <div className='font-medium text-gray-900'>
                        {service.name}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='text-sm text-gray-500'>
                        {service.description || '-'}
                      </div>
                    </td>
                    <td className='table-cell'>
                      {service.feeStructure ? (
                        <div>
                          <div className='font-medium'>
                            ₹{service.feeStructure.amount}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {service.feeStructure.billingCycle}
                          </div>
                        </div>
                      ) : (
                        <span className='text-gray-500'>Not set</span>
                      )}
                    </td>
                    <td className='table-cell'>
                      {service._count.subscriptions}
                    </td>
                    <td className='table-cell'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleEdit(service)}
                          className='text-orange-600 hover:text-orange-900 text-sm'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className='text-red-600 hover:text-red-900 text-sm'
                          disabled={service._count.subscriptions > 0}
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
