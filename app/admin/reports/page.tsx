'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface ReportData {
  totalStudents: number;
  totalFamilies: number;
  totalCourses: number;
  totalServices: number;
  monthlyRevenue: number;
  outstandingDues: number;
  totalDiscounts: number;
  recentPayments: {
    id: string;
    amount: number;
    paymentDate: string;
    family: {
      name: string;
      students: {
        name: string;
      }[];
    };
  }[];
  topCourses: {
    id: string;
    name: string;
    studentCount: number;
    revenue: number;
  }[];
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(6); // June - where we have test data
  const [selectedYear, setSelectedYear] = useState(2024); // 2024 - where we have test data
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'automated' | 'history'
  >('dashboard');
  const [automationReports, setAutomationReports] = useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const fetchReportData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/reports?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        setError('Failed to fetch report data');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  const fetchAutomationReports = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/stored', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAutomationReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch automation reports:', error);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
    if (activeTab === 'automated') {
      fetchAutomationReports();
    }
  }, [fetchReportData, fetchAutomationReports, activeTab]);

  const generateAutomationReport = async (
    reportType: 'weekly' | 'monthly' | 'outstanding'
  ) => {
    setGeneratingReport(reportType);
    try {
      const response = await fetch('/api/automation/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reportType })
      });

      const data = await response.json();

      if (data.success) {
        // Show success toast (user-friendly message)
        alert(
          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`
        );
        fetchAutomationReports(); // Refresh the reports list
      } else {
        alert(`Failed to generate ${reportType} report: ${data.error}`);
      }
    } catch (error) {
      alert('Network error while generating report');
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading reports...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className='space-y-8'>
          <div className='flex justify-between items-center animate-fade-in'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                Reports & Analytics
              </h1>
              <p className='mt-2 text-lg text-gray-600'>
                Comprehensive insights into institute performance
              </p>
            </div>
          </div>
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl animate-fade-in'>
            <div className='flex items-center'>
              <span className='text-red-500 mr-2'>⚠️</span>
              {error}
            </div>
          </div>
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
              Reports & Analytics
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Comprehensive insights and automated reports
            </p>
          </div>
          {activeTab === 'dashboard' && (
            <div className='flex space-x-4'>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(parseInt(e.target.value))}
                className='input-field'
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long'
                    })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(parseInt(e.target.value))}
                className='input-field'
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = 2022 + i; // 2022, 2023, 2024, 2025, 2026
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <div className='flex space-x-1 bg-gray-100 p-1 rounded-xl'>
            {[
              { id: 'dashboard', name: 'Live Dashboard', icon: '📊' },
              { id: 'automated', name: 'Automated Reports', icon: '🤖' },
              { id: 'history', name: 'Report History', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className='mr-2'>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' && reportData && (
          <>
            {/* Key Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in'>
              <div className='card-compact'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-orange-100 text-orange-600 mr-4'>
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Students
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {reportData.totalStudents}
                    </p>
                  </div>
                </div>
              </div>

              <div className='card-compact'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-orange-100 text-orange-600 mr-4'>
                    <svg
                      className='w-6 h-6'
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
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Monthly Revenue
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      ₹{reportData.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className='card-compact'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-orange-100 text-orange-600 mr-4'>
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Outstanding Dues
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      ₹{reportData.outstandingDues.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className='card-compact'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-orange-100 text-orange-700 mr-4'>
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Discounts
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      ₹{reportData.totalDiscounts.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Recent Payments */}
              <div className='card animate-fade-in'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>
                  Recent Payments
                </h3>
                <div className='space-y-4'>
                  {reportData.recentPayments.length === 0 ? (
                    <p className='text-gray-500 text-center py-8'>
                      No recent payments found
                    </p>
                  ) : (
                    reportData.recentPayments.map(payment => (
                      <div
                        key={payment.id}
                        className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'
                      >
                        <div>
                          <p className='font-medium text-gray-900'>
                            {payment.family.students[0]?.name ||
                              'Unknown Student'}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {payment.family.name}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium text-gray-900'>
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Courses */}
              <div className='card animate-fade-in'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>
                  Top Performing Courses
                </h3>
                <div className='space-y-4'>
                  {reportData.topCourses.length === 0 ? (
                    <p className='text-gray-500 text-center py-8'>
                      No course data available
                    </p>
                  ) : (
                    reportData.topCourses.map((course, index) => (
                      <div
                        key={course.id}
                        className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'
                      >
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                            {index + 1}
                          </div>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {course.name}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {course.studentCount} students
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium text-gray-900'>
                            ₹{course.revenue.toLocaleString()}
                          </p>
                          <p className='text-sm text-gray-500'>Revenue</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in'>
              <div className='card-compact text-center'>
                <div className='text-3xl font-bold text-orange-600 mb-2'>
                  {reportData.totalFamilies}
                </div>
                <div className='text-sm font-medium text-gray-600'>
                  Total Families
                </div>
              </div>
              <div className='card-compact text-center'>
                <div className='text-3xl font-bold text-orange-600 mb-2'>
                  {reportData.totalCourses}
                </div>
                <div className='text-sm font-medium text-gray-600'>
                  Active Courses
                </div>
              </div>
              <div className='card-compact text-center'>
                <div className='text-3xl font-bold text-orange-700 mb-2'>
                  {reportData.totalServices}
                </div>
                <div className='text-sm font-medium text-gray-600'>
                  Available Services
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'automated' && (
          <>
            {/* Report Generation Controls */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Generate New Reports
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <button
                  onClick={() => generateAutomationReport('weekly')}
                  disabled={generatingReport === 'weekly'}
                  className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                >
                  {generatingReport === 'weekly' ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <div className='text-lg mb-1'>📊</div>
                      <div>Weekly Summary</div>
                      <div className='text-xs opacity-80'>
                        Last 7 days performance
                      </div>
                    </>
                  )}
                </button>
                <button
                  onClick={() => generateAutomationReport('monthly')}
                  disabled={generatingReport === 'monthly'}
                  className='bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                >
                  {generatingReport === 'monthly' ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <div className='text-lg mb-1'>📈</div>
                      <div>Monthly Analysis</div>
                      <div className='text-xs opacity-80'>
                        Comprehensive monthly metrics
                      </div>
                    </>
                  )}
                </button>
                <button
                  onClick={() => generateAutomationReport('outstanding')}
                  disabled={generatingReport === 'outstanding'}
                  className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                >
                  {generatingReport === 'outstanding' ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <div className='text-lg mb-1'>💰</div>
                      <div>Outstanding Dues</div>
                      <div className='text-xs opacity-80'>
                        Collection analysis
                      </div>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Automated Report Schedule */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Automated Schedule
              </h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200'>
                  <div>
                    <h3 className='font-semibold text-orange-800'>
                      Weekly Performance Reports
                    </h3>
                    <p className='text-sm text-orange-600'>
                      Every Monday at 8:00 AM
                    </p>
                  </div>
                  <div className='text-orange-600'>📊</div>
                </div>
                <div className='flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200'>
                  <div>
                    <h3 className='font-semibold text-orange-800'>
                      Monthly Analysis Reports
                    </h3>
                    <p className='text-sm text-orange-700'>
                      1st day of every month at 8:00 AM
                    </p>
                  </div>
                  <div className='text-orange-700'>📈</div>
                </div>
                <div className='flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200'>
                  <div>
                    <h3 className='font-semibold text-orange-800'>
                      Outstanding Dues Reports
                    </h3>
                    <p className='text-sm text-orange-600'>
                      Every Wednesday at 8:00 AM
                    </p>
                  </div>
                  <div className='text-orange-600'>💰</div>
                </div>
              </div>
            </div>

            {/* Recent Automated Reports */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Recent Reports
              </h2>
              {automationReports.length === 0 ? (
                <div className='text-center py-8'>
                  <div className='text-gray-400 text-4xl mb-4'>📋</div>
                  <p className='text-gray-500'>
                    No automated reports generated yet
                  </p>
                  <p className='text-sm text-gray-400 mt-2'>
                    Generate your first report using the buttons above
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {automationReports.map((report, index) => (
                    <div
                      key={report.id || index}
                      className='flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200'
                    >
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          {report.name}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Generated on{' '}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {report.executionTime &&
                            `Execution time: ${report.executionTime}ms`}
                          {report.fileSize &&
                            ` • Size: ${(report.fileSize / 1024).toFixed(1)}KB`}
                          {report.downloadCount > 0 &&
                            ` • Downloaded ${report.downloadCount} times`}
                        </p>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === 'COMPLETED'
                              ? 'bg-orange-100 text-orange-800'
                              : report.status === 'GENERATING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {report.status.toLowerCase()}
                        </div>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.type === 'WEEKLY'
                              ? 'bg-orange-100 text-orange-800'
                              : report.type === 'MONTHLY'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {report.type.toLowerCase()}
                        </div>
                        <button
                          onClick={() =>
                            window.open(
                              `/api/reports/download/${report.id}`,
                              '_blank'
                            )
                          }
                          className='text-orange-600 hover:text-orange-800 text-sm font-medium'
                          disabled={report.status !== 'COMPLETED'}
                        >
                          {report.status === 'COMPLETED'
                            ? 'Download'
                            : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Report History
            </h2>
            <div className='text-center py-8'>
              <div className='text-gray-400 text-4xl mb-4'>🗂️</div>
              <p className='text-gray-500'>
                Report history feature coming soon
              </p>
              <p className='text-sm text-gray-400 mt-2'>
                This will show all historical reports with download options
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
