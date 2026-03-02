'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useParams } from 'next/navigation';

interface StudentRecord {
  id: string;
  name: string;
  surname?: string;
  studentId?: string;
  idNumber?: string;
  grade?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  totalOwed: number;
  family: { name: string };
  feeAllocations: any[];
  subscriptions: any[];
  academicLogs: any[];
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (!student) return <AdminLayout><div className="p-8">Student not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student.name} {student.surname}</h1>
            <p className="text-gray-500">ID: {student.studentId || 'N/A'} | Grade: {student.grade || 'N/A'}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-xl text-right">
            <p className="text-sm text-orange-600 font-medium">Total Outstanding</p>
            <p className="text-2xl font-bold text-orange-700">R{student.totalOwed.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Fee Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Month</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.feeAllocations.map((fee: any) => (
                      <tr key={fee.id} className="border-t">
                        <td className="py-2">{new Date(fee.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</td>
                        <td className="py-2">R{fee.netAmount.toFixed(2)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${fee.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {student.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {student.phoneNumber || 'N/A'}</p>
                <p><strong>Address:</strong> {student.address || 'N/A'}</p>
                <p><strong>Family:</strong> {student.family.name}</p>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Active Courses</h3>
              <ul className="space-y-2 text-sm">
                {student.subscriptions.map((sub: any) => (
                  <li key={sub.id} className="flex justify-between">
                    <span>{sub.course?.name || sub.service?.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
