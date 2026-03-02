'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface FeeCalculation {
  studentId: string;
  studentName: string;
  grossMonthlyFee: number;
  itemDiscounts: number;
  familyDiscountShare: number;
  totalDiscount: number;
  netMonthlyFee: number;
  breakdown: {
    courses: {
      id: string;
      name: string;
      monthlyAmount: number;
      discount: number;
    }[];
    services: {
      id: string;
      name: string;
      monthlyAmount: number;
      discount: number;
    }[];
  };
}

interface Family {
  id: string;
  name: string;
  students: { id: string; name: string }[];
}

export default function FeesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [feeCalculations, setFeeCalculations] = useState<FeeCalculation[]>([]);
  const [loading, setLoading] = useState(false);
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
      }
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const calculateFamilyFees = async (familyId: string) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/fees/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'family',
          familyId: familyId
        })
      });

      if (response.ok) {
        const calculations = await response.json();
        setFeeCalculations(calculations);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to calculate fees');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFamilySelect = (familyId: string) => {
    setSelectedFamily(familyId);
    if (familyId) {
      calculateFamilyFees(familyId);
    } else {
      setFeeCalculations([]);
    }
  };

  const generateMonthlyAllocations = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/fees/calculate?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        alert('Monthly fee allocations generated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to generate allocations');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const totalFamilyFees = feeCalculations.reduce(
    (sum, calc) => sum + calc.netMonthlyFee,
    0
  );

  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div className='flex justify-between items-center animate-fade-in'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              Fee Management
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Calculate and manage student fees with automatic discount
              allocation
            </p>
          </div>
          <button
            onClick={generateMonthlyAllocations}
            className='btn-success'
            disabled={loading}
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

        {/* Family Selection */}
        <div className='card animate-slide-up'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6'>
            Calculate Family Fees
          </h3>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='family'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                Select Family
              </label>
              <select
                id='family'
                className='input-field'
                value={selectedFamily}
                onChange={e => handleFamilySelect(e.target.value)}
              >
                <option value=''>Choose a family to calculate fees</option>
                {families.map(family => (
                  <option key={family.id} value={family.id}>
                    {family.name} ({family.students?.length || 0} students)
                  </option>
                ))}
              </select>
            </div>
            {selectedFamily && (
              <div className='flex items-end'>
                <button
                  onClick={() => calculateFamilyFees(selectedFamily)}
                  className='btn-primary'
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Recalculate Fees'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fee Calculations */}
        {feeCalculations.length > 0 && (
          <div className='space-y-6 animate-slide-up'>
            {/* Summary Card */}
            <div className='card'>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Fee Summary
              </h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div className='bg-orange-50 rounded-xl p-4'>
                  <div className='text-sm font-medium text-orange-600'>
                    Total Students
                  </div>
                  <div className='text-2xl font-bold text-orange-900'>
                    {feeCalculations.length}
                  </div>
                </div>
                <div className='bg-orange-50 rounded-xl p-4'>
                  <div className='text-sm font-medium text-orange-600'>
                    Total Monthly Fees
                  </div>
                  <div className='text-2xl font-bold text-orange-900'>
                    ₹{totalFamilyFees.toFixed(2)}
                  </div>
                </div>
                <div className='bg-orange-50 rounded-xl p-4'>
                  <div className='text-sm font-medium text-orange-700'>
                    Total Discounts
                  </div>
                  <div className='text-2xl font-bold text-orange-900'>
                    ₹
                    {feeCalculations
                      .reduce((sum, calc) => sum + calc.totalDiscount, 0)
                      .toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className='space-y-4'>
              {feeCalculations.map(calculation => (
                <div key={calculation.studentId} className='card'>
                  <div className='flex justify-between items-start mb-4'>
                    <h4 className='text-xl font-bold text-gray-900'>
                      {calculation.studentName}
                    </h4>
                    <div className='text-right'>
                      <div className='text-sm text-gray-500'>
                        Net Monthly Fee
                      </div>
                      <div className='text-2xl font-bold text-orange-600'>
                        ₹{calculation.netMonthlyFee.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4'>
                    <div className='bg-gray-50 rounded-lg p-3'>
                      <div className='text-sm font-medium text-gray-600'>
                        Gross Fee
                      </div>
                      <div className='text-lg font-bold text-gray-900'>
                        ₹{calculation.grossMonthlyFee.toFixed(2)}
                      </div>
                    </div>
                    <div className='bg-orange-50 rounded-lg p-3'>
                      <div className='text-sm font-medium text-orange-600'>
                        Item Discounts
                      </div>
                      <div className='text-lg font-bold text-orange-900'>
                        ₹{calculation.itemDiscounts.toFixed(2)}
                      </div>
                    </div>
                    <div className='bg-orange-50 rounded-lg p-3'>
                      <div className='text-sm font-medium text-orange-600'>
                        Family Discount
                      </div>
                      <div className='text-lg font-bold text-orange-900'>
                        ₹{calculation.familyDiscountShare.toFixed(2)}
                      </div>
                    </div>
                    <div className='bg-red-50 rounded-lg p-3'>
                      <div className='text-sm font-medium text-red-600'>
                        Total Discount
                      </div>
                      <div className='text-lg font-bold text-red-900'>
                        ₹{calculation.totalDiscount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {calculation.breakdown.courses.length > 0 && (
                      <div>
                        <h5 className='font-semibold text-gray-900 mb-2'>
                          Courses
                        </h5>
                        <div className='space-y-2'>
                          {calculation.breakdown.courses.map(course => (
                            <div
                              key={course.id}
                              className='flex justify-between text-sm'
                            >
                              <span>{course.name}</span>
                              <span>
                                ₹{course.monthlyAmount.toFixed(2)}{' '}
                                {course.discount > 0 &&
                                  `(-₹${course.discount})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {calculation.breakdown.services.length > 0 && (
                      <div>
                        <h5 className='font-semibold text-gray-900 mb-2'>
                          Services
                        </h5>
                        <div className='space-y-2'>
                          {calculation.breakdown.services.map(service => (
                            <div
                              key={service.id}
                              className='flex justify-between text-sm'
                            >
                              <span>{service.name}</span>
                              <span>
                                ₹{service.monthlyAmount.toFixed(2)}{' '}
                                {service.discount > 0 &&
                                  `(-₹${service.discount})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
