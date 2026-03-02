'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PaymentForm from '@/components/forms/PaymentForm';

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  paymentDate: string;
  status: string;
  student: {
    id: string;
    name: string;
    family: {
      id: string;
      name: string;
    };
  };
  allocations: {
    id: string;
    amount: number;
    feeAllocation: {
      id: string;
      month: number;
      year: number;
      netAmount: number;
    };
  }[];
  createdAt: string;
}

interface FeeAllocation {
  id: string;
  month: number;
  year: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  status: string;
  dueDate: string;
  student: {
    id: string;
    name: string;
    family: {
      id: string;
      name: string;
    };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingAllocations, setPendingAllocations] = useState<FeeAllocation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchPendingAllocations();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        setError('Failed to fetch payments');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const fetchPendingAllocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/allocations?status=PENDING', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingAllocations(data);
      }
    } catch (error) {
      console.error('Error fetching pending allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCurrentMonthAllocations = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const year = currentDate.getFullYear();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ month, year })
      });

      if (response.ok) {
        alert('Monthly fee allocations generated successfully!');
        fetchPendingAllocations();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to generate allocations');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handlePaymentSuccess = (payment: Payment) => {
    setPayments([payment, ...payments]);
    setShowForm(false);
    setSelectedStudent('');
    fetchPendingAllocations(); // Refresh pending allocations
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedStudent('');
  };

  const handleRecordPayment = (studentId: string) => {
    setSelectedStudent(studentId);
    setShowForm(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading payments...</div>
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
              Payments
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Record payments and manage fee allocations
            </p>
          </div>
          <div className='flex space-x-4'>
            <button
              onClick={generateCurrentMonthAllocations}
              className='btn-success'
            >
              <svg
                className='w-5 h-5 mr-2'
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
              Generate This Month&apos;s Bills
            </button>
            <button onClick={() => setShowForm(true)} className='btn-primary'>
              <span className='mr-2'>+</span>
              Record Payment
            </button>
          </div>
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
              Record New Payment
            </h3>
            <PaymentForm
              selectedStudentId={selectedStudent}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Pending Allocations */}
        {pendingAllocations.length > 0 && (
          <div className='card animate-slide-up'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>
              Pending Fee Payments
            </h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='table-header'>Student</th>
                    <th className='table-header'>Family</th>
                    <th className='table-header'>Month/Year</th>
                    <th className='table-header'>Amount Due</th>
                    <th className='table-header'>Due Date</th>
                    <th className='table-header'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {pendingAllocations.map(allocation => (
                    <tr
                      key={allocation.id}
                      className='hover:bg-gray-50 transition-colors duration-200'
                    >
                      <td className='table-cell'>
                        <div className='font-medium text-gray-900'>
                          {allocation.student.name}
                        </div>
                      </td>
                      <td className='table-cell'>
                        <div className='text-gray-900'>
                          {allocation.student.family.name}
                        </div>
                      </td>
                      <td className='table-cell'>
                        <div className='font-medium'>
                          {new Date(
                            allocation.year,
                            allocation.month - 1
                          ).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className='table-cell'>
                        <div className='font-bold text-orange-600'>
                          ₹{allocation.netAmount.toFixed(2)}
                        </div>
                        {allocation.discountAmount > 0 && (
                          <div className='text-sm text-gray-500'>
                            (₹{allocation.grossAmount.toFixed(2)} - ₹
                            {allocation.discountAmount.toFixed(2)})
                          </div>
                        )}
                      </td>
                      <td className='table-cell'>
                        <div
                          className={`text-sm ${new Date(allocation.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                        >
                          {new Date(allocation.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className='table-cell'>
                        <button
                          onClick={() =>
                            handleRecordPayment(allocation.student.id)
                          }
                          className='bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200'
                        >
                          Record Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Payments */}
        <div className='table-container animate-slide-up'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Recent Payments
            </h3>
          </div>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='table-header'>Student</th>
                <th className='table-header'>Family</th>
                <th className='table-header'>Amount</th>
                <th className='table-header'>Payment Method</th>
                <th className='table-header'>Reference</th>
                <th className='table-header'>Date</th>
                <th className='table-header'>Status</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='table-cell text-center text-gray-500'
                  >
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr
                    key={payment.id}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='table-cell'>
                      <div className='font-medium text-gray-900'>
                        {payment.student.name}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='text-gray-900'>
                        {payment.student.family.name}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='font-bold text-orange-600'>
                        ₹{payment.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className='table-cell'>
                      <div className='text-sm text-gray-600'>
                        {payment.referenceNumber || '-'}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <div className='text-sm text-gray-900'>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'COMPLETED'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
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
