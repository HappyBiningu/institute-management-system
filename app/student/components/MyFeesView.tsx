'use client';

import { useState, useEffect } from 'react';

interface FeeAllocation {
  id: string;
  month: string;
  year: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  status: 'PAID' | 'PENDING';
  dueDate: string;
  paidDate?: string;
}

interface PaymentHistory {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
}

export default function MyFeesView() {
  const [feeAllocations, setFeeAllocations] = useState<FeeAllocation[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    // Mock data for student's fee allocations and payment history
    setFeeAllocations([
      {
        id: '1',
        month: 'June 2024',
        year: 2024,
        grossAmount: 9000,
        discountAmount: 500,
        netAmount: 8500,
        status: 'PAID',
        dueDate: '2024-06-15',
        paidDate: '2024-06-10'
      },
      {
        id: '2',
        month: 'May 2024',
        year: 2024,
        grossAmount: 9000,
        discountAmount: 500,
        netAmount: 8500,
        status: 'PAID',
        dueDate: '2024-05-15',
        paidDate: '2024-05-12'
      },
      {
        id: '3',
        month: 'April 2024',
        year: 2024,
        grossAmount: 9000,
        discountAmount: 500,
        netAmount: 8500,
        status: 'PAID',
        dueDate: '2024-04-15',
        paidDate: '2024-04-14'
      },
      {
        id: '4',
        month: 'March 2024',
        year: 2024,
        grossAmount: 9000,
        discountAmount: 500,
        netAmount: 8500,
        status: 'PENDING',
        dueDate: '2024-03-15'
      }
    ]);

    setPaymentHistory([
      {
        id: '1',
        amount: 8500,
        paymentDate: '2024-06-10',
        paymentMethod: 'BANK_TRANSFER',
        reference: 'PAY-FAMILY-1-202406'
      },
      {
        id: '2',
        amount: 8500,
        paymentDate: '2024-05-12',
        paymentMethod: 'CARD',
        reference: 'PAY-FAMILY-1-202405'
      },
      {
        id: '3',
        amount: 8500,
        paymentDate: '2024-04-14',
        paymentMethod: 'CASH',
        reference: 'PAY-FAMILY-1-202404'
      }
    ]);

    setLoading(false);
  }, []);

  const totalPaid = paymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalOutstanding = feeAllocations
    .filter(allocation => allocation.status === 'PENDING')
    .reduce((sum, allocation) => sum + allocation.netAmount, 0);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return '💵';
      case 'CARD':
        return '💳';
      case 'BANK_TRANSFER':
        return '🏦';
      case 'CHEQUE':
        return '📝';
      default:
        return '💰';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'PAID'
      ? 'text-orange-600 bg-orange-100'
      : 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>Fees & Payments</h2>
        <p className='text-gray-600 mt-1'>
          Track your fee structure, payments, and outstanding dues
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Paid</p>
              <p className='text-2xl font-bold text-orange-600'>
                ₹{totalPaid.toLocaleString()}
              </p>
              <p className='text-sm text-gray-500 mt-1'>This academic year</p>
            </div>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <span className='text-2xl'>✅</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Outstanding Dues
              </p>
              <p
                className={`text-2xl font-bold ${totalOutstanding > 0 ? 'text-red-600' : 'text-orange-600'}`}
              >
                ₹{totalOutstanding.toLocaleString()}
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                {totalOutstanding > 0 ? 'Payment pending' : 'All clear!'}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${totalOutstanding > 0 ? 'bg-red-100' : 'bg-orange-100'}`}
            >
              <span className='text-2xl'>
                {totalOutstanding > 0 ? '⚠️' : '🎉'}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Monthly Fee</p>
              <p className='text-2xl font-bold text-orange-600'>₹8,500</p>
              <p className='text-sm text-gray-500 mt-1'>After discounts</p>
            </div>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <span className='text-2xl'>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          💳 Current Month Fee Breakdown
        </h3>
        <div className='space-y-4'>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='font-medium text-gray-900'>
              Advanced Mathematics
            </span>
            <span className='text-gray-600'>₹2,500</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='font-medium text-gray-900'>Physics</span>
            <span className='text-gray-600'>₹2,800</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='font-medium text-gray-900'>
              English Literature
            </span>
            <span className='text-gray-600'>₹2,200</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='font-medium text-gray-900'>
              Bus Transportation
            </span>
            <span className='text-gray-600'>₹1,000</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='font-medium text-gray-900'>Library Access</span>
            <span className='text-gray-600'>₹400</span>
          </div>

          <div className='border-t border-gray-200 pt-3'>
            <div className='flex justify-between items-center text-lg font-semibold'>
              <span>Gross Amount:</span>
              <span>₹9,000</span>
            </div>
            <div className='flex justify-between items-center text-orange-600'>
              <span>Merit Discount:</span>
              <span>-₹500</span>
            </div>
            <div className='flex justify-between items-center text-xl font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200'>
              <span>Net Amount:</span>
              <span>₹8,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fee History */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            📊 Fee History
          </h3>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className='border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent'
          >
            <option value='current'>Current Year</option>
            <option value='last'>Last Year</option>
            <option value='all'>All Time</option>
          </select>
        </div>

        <div className='space-y-3'>
          {feeAllocations.map(allocation => (
            <div
              key={allocation.id}
              className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
            >
              <div className='flex-1'>
                <div className='flex items-center space-x-3'>
                  <span className='font-medium text-gray-900'>
                    {allocation.month}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.status)}`}
                  >
                    {allocation.status}
                  </span>
                </div>
                <div className='text-sm text-gray-600 mt-1'>
                  Due: {new Date(allocation.dueDate).toLocaleDateString()}
                  {allocation.paidDate && (
                    <span className='ml-4'>
                      Paid: {new Date(allocation.paidDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <div className='font-semibold text-gray-900'>
                  ₹{allocation.netAmount.toLocaleString()}
                </div>
                {allocation.discountAmount > 0 && (
                  <div className='text-sm text-orange-600'>
                    Discount: ₹{allocation.discountAmount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          💳 Payment History
        </h3>
        <div className='space-y-3'>
          {paymentHistory.map(payment => (
            <div
              key={payment.id}
              className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
            >
              <div className='flex items-center space-x-4'>
                <div className='p-2 bg-orange-100 rounded-lg'>
                  <span className='text-lg'>
                    {getPaymentMethodIcon(payment.paymentMethod)}
                  </span>
                </div>
                <div>
                  <div className='font-medium text-gray-900'>
                    ₹{payment.amount.toLocaleString()}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {new Date(payment.paymentDate).toLocaleDateString()} •{' '}
                    {payment.paymentMethod.replace('_', ' ')}
                  </div>
                  <div className='text-xs text-gray-500'>
                    Ref: {payment.reference}
                  </div>
                </div>
              </div>
              <div className='text-orange-600 font-medium'>✅ Completed</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      {totalOutstanding > 0 && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-yellow-800 mb-3'>
            ⚠️ Payment Required
          </h3>
          <p className='text-yellow-700 mb-4'>
            You have outstanding dues of ₹{totalOutstanding.toLocaleString()}.
            Please contact the administration office for payment options.
          </p>
          <div className='space-y-2 text-sm text-yellow-700'>
            <p>
              <strong>Payment Methods:</strong> Cash, Card, Bank Transfer,
              Cheque
            </p>
            <p>
              <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
            </p>
            <p>
              <strong>Contact:</strong> +1-217-555-0100 | fees@randtrainingcollege.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
