'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface AutomationStatus {
  systemStatus: {
    automationEngine: string;
    scheduler: string;
    timestamp: string;
  };
  runningJobs: Array<{
    id: string;
    type: string;
    status: string;
    startTime: string;
    endTime?: string;
    duration?: number;
  }>;
  scheduledJobs: Array<{
    id: string;
    name: string;
    schedule: string;
    description: string;
    isActive: boolean;
    lastRun?: string;
    nextRun?: string;
  }>;
  summary: {
    totalRunningJobs: number;
    totalScheduledJobs: number;
    activeScheduledJobs: number;
  };
}

export default function OperationsPage() {
  const [automationStatus, setAutomationStatus] =
    useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggeringJob, setTriggeringJob] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'reminders' | 'reports'
  >('overview');

  useEffect(() => {
    fetchAutomationStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchAutomationStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAutomationStatus = async () => {
    try {
      const response = await fetch('/api/automation/status');
      const data = await response.json();

      if (data.success) {
        setAutomationStatus(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch automation status');
      }
    } catch (err) {
      setError('Network error while fetching automation status');
      console.error('Error fetching automation status:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerMonthlyBilling = async () => {
    setTriggeringJob('monthly-billing');
    try {
      const response = await fetch('/api/automation/monthly-billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Use current month/year
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Monthly billing completed successfully!\n\nGenerated ${data.data.successfulBills} bills out of ${data.data.totalStudents} students.\nExecution time: ${data.data.executionTime}ms`
        );
        fetchAutomationStatus(); // Refresh status
      } else {
        alert(
          `Monthly billing failed: ${data.error}\n\nDetails: ${data.details || 'No additional details'}`
        );
      }
    } catch (err) {
      alert('Network error while triggering monthly billing');
      console.error('Error triggering monthly billing:', err);
    } finally {
      setTriggeringJob(null);
    }
  };

  const triggerFeeReminder = async (
    reminderType: 'early' | 'due' | 'overdue'
  ) => {
    setTriggeringJob(`fee-reminder-${reminderType}`);
    try {
      const response = await fetch('/api/automation/fee-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reminderType })
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Fee reminders (${reminderType}) sent successfully!\n\nSent ${data.data.successfulReminders} reminders out of ${data.data.totalAllocations} due allocations.\nExecution time: ${data.data.executionTime}ms`
        );
        fetchAutomationStatus(); // Refresh status
      } else {
        alert(
          `Fee reminders (${reminderType}) failed: ${data.error}\n\nDetails: ${data.details || 'No additional details'}`
        );
      }
    } catch (err) {
      alert('Network error while triggering fee reminders');
      console.error('Error triggering fee reminders:', err);
    } finally {
      setTriggeringJob(null);
    }
  };

  const triggerReport = async (
    reportType: 'monthly' | 'weekly' | 'outstanding'
  ) => {
    setTriggeringJob(`report-${reportType}`);
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
        alert(
          `Report (${reportType}) generated successfully!\n\nExecution time: ${data.data.executionTime}ms\n\nCheck the server logs for report details.`
        );
        fetchAutomationStatus(); // Refresh status
      } else {
        alert(
          `Report generation (${reportType}) failed: ${data.error}\n\nDetails: ${data.details || 'No additional details'}`
        );
      }
    } catch (err) {
      alert('Network error while triggering report generation');
      console.error('Error triggering report generation:', err);
    } finally {
      setTriggeringJob(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center min-h-96'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading automation status...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='animate-fade-in'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Operations Dashboard
          </h1>
          <p className='mt-2 text-lg text-gray-600'>
            Automation & Operations Management
          </p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <p className='mt-1 text-sm text-red-700'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <div className='flex space-x-1 bg-gray-100 p-1 rounded-xl'>
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'reminders', name: 'Fee Reminders', icon: '📧' },
              { id: 'reports', name: 'Reports', icon: '📈' }
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

        {automationStatus && (
          <>
            {activeTab === 'overview' && (
              <>
                {/* System Status */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    System Status
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-orange-50 rounded-xl p-4 border border-orange-200'>
                      <div className='flex items-center'>
                        <div className='h-3 w-3 bg-orange-500 rounded-full mr-3'></div>
                        <div>
                          <p className='text-sm font-medium text-orange-800'>
                            Automation Engine
                          </p>
                          <p className='text-xs text-orange-600 capitalize'>
                            {automationStatus.systemStatus.automationEngine}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='bg-orange-50 rounded-xl p-4 border border-orange-200'>
                      <div className='flex items-center'>
                        <div className='h-3 w-3 bg-orange-500 rounded-full mr-3'></div>
                        <div>
                          <p className='text-sm font-medium text-orange-800'>
                            Scheduler
                          </p>
                          <p className='text-xs text-orange-600 capitalize'>
                            {automationStatus.systemStatus.scheduler}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                      <div>
                        <p className='text-sm font-medium text-gray-800'>
                          Last Updated
                        </p>
                        <p className='text-xs text-gray-600'>
                          {formatDateTime(
                            automationStatus.systemStatus.timestamp
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Quick Actions
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <button
                      onClick={triggerMonthlyBilling}
                      disabled={triggeringJob === 'monthly-billing'}
                      className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'monthly-billing' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Generating Bills...
                        </div>
                      ) : (
                        'Trigger Monthly Billing'
                      )}
                    </button>
                    <button
                      onClick={() => triggerFeeReminder('overdue')}
                      disabled={triggeringJob === 'fee-reminder-overdue'}
                      className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'fee-reminder-overdue' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Sending Reminders...
                        </div>
                      ) : (
                        'Send Overdue Reminders'
                      )}
                    </button>
                    <button
                      onClick={() => triggerReport('monthly')}
                      disabled={triggeringJob === 'report-monthly'}
                      className='bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'report-monthly' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Generating Report...
                        </div>
                      ) : (
                        'Generate Monthly Report'
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reminders' && (
              <>
                {/* Fee Reminder Controls */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Fee Reminder Management
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <button
                      onClick={() => triggerFeeReminder('early')}
                      disabled={triggeringJob === 'fee-reminder-early'}
                      className='bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'fee-reminder-early' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <div className='text-lg mb-1'>📅</div>
                          <div>Early Reminders</div>
                          <div className='text-xs opacity-80'>
                            3 days before due
                          </div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => triggerFeeReminder('due')}
                      disabled={triggeringJob === 'fee-reminder-due'}
                      className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'fee-reminder-due' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <div className='text-lg mb-1'>⏰</div>
                          <div>Due Date Reminders</div>
                          <div className='text-xs opacity-80'>Due today</div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => triggerFeeReminder('overdue')}
                      disabled={triggeringJob === 'fee-reminder-overdue'}
                      className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'fee-reminder-overdue' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <div className='text-lg mb-1'>🚨</div>
                          <div>Overdue Reminders</div>
                          <div className='text-xs opacity-80'>
                            Past due date
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reminder Schedule */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Automated Reminder Schedule
                  </h2>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200'>
                      <div>
                        <h3 className='font-semibold text-yellow-800'>
                          Early Fee Reminders
                        </h3>
                        <p className='text-sm text-yellow-600'>
                          Daily at 9:00 AM - 3 days before due date
                        </p>
                      </div>
                      <div className='text-yellow-600'>📅</div>
                    </div>
                    <div className='flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200'>
                      <div>
                        <h3 className='font-semibold text-orange-800'>
                          Due Date Reminders
                        </h3>
                        <p className='text-sm text-orange-600'>
                          Daily at 10:00 AM - on due date
                        </p>
                      </div>
                      <div className='text-orange-600'>⏰</div>
                    </div>
                    <div className='flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200'>
                      <div>
                        <h3 className='font-semibold text-red-800'>
                          Overdue Reminders
                        </h3>
                        <p className='text-sm text-red-600'>
                          Daily at 11:00 AM - for overdue payments
                        </p>
                      </div>
                      <div className='text-red-600'>🚨</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reports' && (
              <>
                {/* Report Generation Controls */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Report Generation
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <button
                      onClick={() => triggerReport('weekly')}
                      disabled={triggeringJob === 'report-weekly'}
                      className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'report-weekly' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Generating...
                        </div>
                      ) : (
                        <>
                          <div className='text-lg mb-1'>📊</div>
                          <div>Weekly Report</div>
                          <div className='text-xs opacity-80'>Last 7 days</div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => triggerReport('monthly')}
                      disabled={triggeringJob === 'report-monthly'}
                      className='bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'report-monthly' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Generating...
                        </div>
                      ) : (
                        <>
                          <div className='text-lg mb-1'>📈</div>
                          <div>Monthly Report</div>
                          <div className='text-xs opacity-80'>
                            Current month
                          </div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => triggerReport('outstanding')}
                      disabled={triggeringJob === 'report-outstanding'}
                      className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                    >
                      {triggeringJob === 'report-outstanding' ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                          Generating...
                        </div>
                      ) : (
                        <>
                          <div className='text-lg mb-1'>💰</div>
                          <div>Outstanding Dues</div>
                          <div className='text-xs opacity-80'>
                            Overdue payments
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Report Schedule */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Automated Report Schedule
                  </h2>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200'>
                      <div>
                        <h3 className='font-semibold text-orange-800'>
                          Weekly Reports
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
                          Monthly Reports
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
              </>
            )}

            {/* Scheduled Jobs */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Scheduled Jobs
              </h2>
              {automationStatus.scheduledJobs.length === 0 ? (
                <p className='text-gray-500'>No scheduled jobs configured.</p>
              ) : (
                <div className='space-y-4'>
                  {automationStatus.scheduledJobs.map(job => (
                    <div
                      key={job.id}
                      className='border border-gray-200 rounded-xl p-4'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-semibold text-gray-900'>
                            {job.name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {job.description}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            Schedule: {job.schedule}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              job.isActive
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {job.isActive ? 'Active' : 'Inactive'}
                          </div>
                          {job.lastRun && (
                            <p className='text-xs text-gray-500 mt-1'>
                              Last run: {formatDateTime(job.lastRun)}
                            </p>
                          )}
                          {job.nextRun && (
                            <p className='text-xs text-gray-500'>
                              Next run: {formatDateTime(job.nextRun)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Running Jobs */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Running Jobs
              </h2>
              {automationStatus.runningJobs.length === 0 ? (
                <p className='text-gray-500'>No jobs currently running.</p>
              ) : (
                <div className='space-y-4'>
                  {automationStatus.runningJobs.map(job => (
                    <div
                      key={job.id}
                      className='border border-gray-200 rounded-xl p-4'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-semibold text-gray-900'>
                            {job.type}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            Started: {formatDateTime(job.startTime)}
                          </p>
                          {job.endTime && (
                            <p className='text-sm text-gray-600'>
                              Completed: {formatDateTime(job.endTime)}
                            </p>
                          )}
                        </div>
                        <div className='text-right'>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              job.status === 'RUNNING'
                                ? 'bg-orange-100 text-orange-800'
                                : job.status === 'COMPLETED'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {job.status}
                          </div>
                          {job.duration && (
                            <p className='text-xs text-gray-500 mt-1'>
                              Duration: {formatDuration(job.duration)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
