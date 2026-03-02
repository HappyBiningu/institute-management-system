'use client';

import { useState, useEffect, useCallback } from 'react';
import StatCard from '../../../components/shared/StatCard';
import EmptyState from '../../../components/shared/EmptyState';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  assignmentType: string;
  priority: string;
  dueDate: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
  teacher: {
    name: string;
  };
  submissions: {
    id: string;
    status: string;
    submittedAt: string | null;
    grade: string | null;
    feedback: string | null;
  }[];
}

interface AssignmentStats {
  totalAssignments: number;
  submittedCount: number;
  pendingCount: number;
  overdueCount: number;
  gradedCount: number;
  completionRate: number;
  subjectStats: Record<string, any>;
  recentActivity: any[];
}

export default function AssignmentsView() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionContent, setSubmissionContent] = useState('');

  const fetchAssignments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/assignments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments || []);
      } else {
        setError('Failed to fetch assignments');
      }
    } catch (error) {
      setError('Network error');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/assignments/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
    fetchStats();
  }, [fetchAssignments, fetchStats]);

  const handleSubmitAssignment = async (assignmentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/assignments/submissions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId,
          content: submissionContent
        })
      });

      if (response.ok) {
        setShowSubmissionForm(false);
        setSubmissionContent('');
        setSelectedAssignment(null);
        fetchAssignments(); // Refresh assignments
        fetchStats(); // Refresh stats
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit assignment');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSubject =
      filterSubject === 'all' || assignment.subject === filterSubject;
    const matchesType =
      filterType === 'all' || assignment.assignmentType === filterType;

    let matchesStatus = true;
    if (filterStatus === 'pending') {
      matchesStatus = assignment.submissions.length === 0;
    } else if (filterStatus === 'submitted') {
      matchesStatus = assignment.submissions.length > 0;
    } else if (filterStatus === 'overdue') {
      matchesStatus = Boolean(
        assignment.dueDate &&
          new Date() > new Date(assignment.dueDate) &&
          assignment.submissions.length === 0
      );
    }

    return matchesSubject && matchesType && matchesStatus;
  });

  const getAssignmentStatus = (assignment: Assignment) => {
    if (assignment.submissions.length > 0) {
      return assignment.submissions[0].status;
    }
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      return 'OVERDUE';
    }
    return 'PENDING';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-orange-100 text-orange-800';
      case 'GRADED':
        return 'bg-orange-100 text-orange-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-800';
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HOMEWORK':
        return '📝';
      case 'PROJECT':
        return '🎯';
      case 'QUIZ':
        return '❓';
      case 'EXAM':
        return '📊';
      case 'NOTE':
        return '📋';
      default:
        return '📄';
    }
  };

  const uniqueSubjects = Array.from(new Set(assignments.map(a => a.subject)));
  const uniqueTypes = Array.from(
    new Set(assignments.map(a => a.assignmentType))
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg'>Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Assignment Statistics */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <StatCard
            title='Total Assignments'
            value={stats.totalAssignments}
            subtitle='All assignments'
            icon='📋'
            color='blue'
          />
          <StatCard
            title='Submitted'
            value={stats.submittedCount}
            subtitle={`${stats.completionRate}% completion`}
            icon='✅'
            color='green'
          />
          <StatCard
            title='Pending'
            value={stats.pendingCount}
            subtitle='Need attention'
            icon='⏳'
            color='yellow'
          />
          <StatCard
            title='Overdue'
            value={stats.overdueCount}
            subtitle={stats.overdueCount > 0 ? 'Urgent!' : 'All good!'}
            icon={stats.overdueCount > 0 ? '🚨' : '😊'}
            color={stats.overdueCount > 0 ? 'red' : 'green'}
          />
        </div>
      )}

      {/* Filters */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Filter Assignments
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Subject
            </label>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            >
              <option value='all'>All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='submitted'>Submitted</option>
              <option value='overdue'>Overdue</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Type
            </label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            >
              <option value='all'>All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      {/* Assignments List */}
      <div className='space-y-4'>
        {filteredAssignments.length === 0 ? (
          <EmptyState
            icon='📋'
            title='No Assignments Found'
            description="No assignments match your current filters or you're all caught up!"
          />
        ) : (
          filteredAssignments.map(assignment => {
            const status = getAssignmentStatus(assignment);
            const isSubmitted = assignment.submissions.length > 0;

            return (
              <div
                key={assignment.id}
                className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow'
              >
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <span className='text-2xl'>
                        {getTypeIcon(assignment.assignmentType)}
                      </span>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {assignment.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(assignment.priority)}`}
                      >
                        {assignment.priority}
                      </span>
                    </div>
                    <p className='text-gray-600 mb-3'>
                      {assignment.description}
                    </p>
                    <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                      <span>📚 {assignment.subject}</span>
                      <span>👨‍🏫 {assignment.teacher.name}</span>
                      {assignment.dueDate && (
                        <span>
                          📅 Due:{' '}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {assignment.attachmentName && (
                        <span>📎 {assignment.attachmentName}</span>
                      )}
                    </div>
                  </div>
                  <div className='ml-4'>
                    {!isSubmitted && (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmissionForm(true);
                        }}
                        className='bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors'
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>

                {isSubmitted && (
                  <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Your Submission
                    </h4>
                    <div className='text-sm text-gray-600'>
                      <p>
                        Submitted:{' '}
                        {new Date(
                          assignment.submissions[0].submittedAt!
                        ).toLocaleString()}
                      </p>
                      {assignment.submissions[0].grade && (
                        <p>Grade: {assignment.submissions[0].grade}</p>
                      )}
                      {assignment.submissions[0].feedback && (
                        <p className='mt-2'>
                          Feedback: {assignment.submissions[0].feedback}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      {showSubmissionForm && selectedAssignment && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Submit: {selectedAssignment.title}
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Your Response
                </label>
                <textarea
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
                  rows={6}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter your assignment response...'
                />
              </div>
              <div className='flex space-x-3'>
                <button
                  onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                  disabled={!submissionContent.trim()}
                  className='flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  Submit Assignment
                </button>
                <button
                  onClick={() => {
                    setShowSubmissionForm(false);
                    setSelectedAssignment(null);
                    setSubmissionContent('');
                  }}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
