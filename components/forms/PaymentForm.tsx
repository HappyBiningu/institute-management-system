'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  family: {
    id: string;
    name: string;
  };
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
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  paymentDate: string;
  status: string;
  student: Student;
  allocations: any[];
  createdAt: string;
}

interface PaymentFormProps {
  selectedStudentId?: string;
  onSuccess: (payment: Payment) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  selectedStudentId,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    studentId: selectedStudentId || '',
    amount: '',
    paymentMethod: 'CASH',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [pendingAllocations, setPendingAllocations] = useState<FeeAllocation[]>(
    []
  );
  const [selectedAllocations, setSelectedAllocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
    if (selectedStudentId) {
      setFormData(prev => ({ ...prev, studentId: selectedStudentId }));
      fetchPendingAllocations(selectedStudentId);
    }
  }, [selectedStudentId]);

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
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchPendingAllocations = async (studentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/allocations?studentId=${studentId}&status=PENDING`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingAllocations(data);
      }
    } catch (error) {
      console.error('Error fetching pending allocations:', error);
    }
  };

  const handleStudentChange = (studentId: string) => {
    setFormData(prev => ({ ...prev, studentId }));
    setSelectedAllocations([]);
    if (studentId) {
      fetchPendingAllocations(studentId);
    } else {
      setPendingAllocations([]);
    }
  };

  const handleAllocationToggle = (allocationId: string) => {
    setSelectedAllocations(prev => {
      if (prev.includes(allocationId)) {
        return prev.filter(id => id !== allocationId);
      } else {
        return [...prev, allocationId];
      }
    });
  };

  const calculateTotalAmount = () => {
    return pendingAllocations
      .filter(allocation => selectedAllocations.includes(allocation.id))
      .reduce((sum, allocation) => sum + allocation.netAmount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Prepare allocations data
      const allocations = selectedAllocations.map(allocationId => {
        const allocation = pendingAllocations.find(a => a.id === allocationId);
        return {
          feeAllocationId: allocationId,
          amount: allocation?.netAmount || 0
        };
      });

      const payload = {
        studentId: formData.studentId,
        amount: formData.amount || calculateTotalAmount(),
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber || null,
        paymentDate: formData.paymentDate,
        allocations
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
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
        setError(data.error || 'Failed to record payment');
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
        <div>
          <label
            htmlFor='studentId'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Student *
          </label>
          <select
            name='studentId'
            id='studentId'
            required
            className='input-field'
            value={formData.studentId}
            onChange={e => handleStudentChange(e.target.value)}
          >
            <option value=''>Select a student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.family.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='paymentDate'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Payment Date *
          </label>
          <input
            type='date'
            name='paymentDate'
            id='paymentDate'
            required
            className='input-field'
            value={formData.paymentDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor='paymentMethod'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Payment Method *
          </label>
          <select
            name='paymentMethod'
            id='paymentMethod'
            required
            className='input-field'
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value='CASH'>Cash</option>
            <option value='BANK_TRANSFER'>Bank Transfer</option>
            <option value='CHEQUE'>Cheque</option>
            <option value='UPI'>UPI</option>
            <option value='CARD'>Card</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='referenceNumber'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Reference Number
          </label>
          <input
            type='text'
            name='referenceNumber'
            id='referenceNumber'
            className='input-field'
            value={formData.referenceNumber}
            onChange={handleChange}
            placeholder='Transaction ID, Cheque number, etc.'
          />
        </div>
      </div>

      {/* Pending Allocations */}
      {pendingAllocations.length > 0 && (
        <div className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200'>
          <h4 className='text-xl font-bold text-gray-900 mb-4'>
            Pending Fee Allocations
          </h4>
          <div className='space-y-3'>
            {pendingAllocations.map(allocation => (
              <div
                key={allocation.id}
                className='flex items-center justify-between bg-white rounded-lg p-3'
              >
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id={`allocation-${allocation.id}`}
                    checked={selectedAllocations.includes(allocation.id)}
                    onChange={() => handleAllocationToggle(allocation.id)}
                    className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor={`allocation-${allocation.id}`}
                    className='ml-3 text-sm font-medium text-gray-900'
                  >
                    {new Date(
                      allocation.year,
                      allocation.month - 1
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </label>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-orange-600'>
                    ₹{allocation.netAmount.toFixed(2)}
                  </div>
                  <div className='text-xs text-gray-500'>
                    Due: {new Date(allocation.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedAllocations.length > 0 && (
            <div className='mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200'>
              <div className='flex justify-between items-center'>
                <span className='font-medium text-orange-800'>
                  Total Amount:
                </span>
                <span className='text-xl font-bold text-orange-900'>
                  ₹{calculateTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Amount Entry */}
      <div>
        <label
          htmlFor='amount'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Payment Amount (₹){' '}
          {selectedAllocations.length > 0 &&
            '(Auto-calculated from selected allocations)'}
        </label>
        <input
          type='number'
          name='amount'
          id='amount'
          min='0'
          step='0.01'
          className='input-field'
          value={
            selectedAllocations.length > 0
              ? calculateTotalAmount()
              : formData.amount
          }
          onChange={handleChange}
          placeholder='0.00'
          disabled={selectedAllocations.length > 0}
        />
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
              Recording...
            </div>
          ) : (
            'Record Payment'
          )}
        </button>
      </div>
    </form>
  );
}
