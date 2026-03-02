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
  grade: string | null;
  studentId: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
  teacher: {
    name: string;
  };
  student?: {
    name: string;
    grade: string;
  };
  submissions: {
    id: string;
    status: string;
    submittedAt: string | null;
    grade: string | null;
    feedback: string | null;
    student: {
      name: string;
      grade: string;
    };
  }[];
}

interface AssignmentStats {
  totalAssignments: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingGrading: number;
  gradingProgress: number;
  recentSubmissions: any[];
}

interface Student {
  id: string;
  name: string;
  grade: string;
  studentId: string;
}

export default function AssignmentsManager() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    assignmentType: 'HOMEWORK',
    priority: 'MEDIUM',
    dueDate: '',
    grade: '',
    studentId: ''
  });

  const [gradingData, setGradingData] = useState({
    grade: '',
    feedback: ''
  });

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

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
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
    fetchStudents();
    fetchStats();
  }, [fetchAssignments, fetchStudents, fetchStats]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || null,
          grade: formData.grade || null,
          studentId: formData.studentId || null
        })
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          subject: '',
          assignmentType: 'HOMEWORK',
          priority: 'MEDIUM',
          dueDate: '',
          grade: '',
          studentId: ''
        });
        fetchAssignments();
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create assignment');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/assignments/submissions/${selectedSubmission.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...gradingData,
            status: 'GRADED'
          })
        }
      );

      if (response.ok) {
        setShowGradingModal(false);
        setSelectedSubmission(null);
        setGradingData({ grade: '', feedback: '' });
        fetchAssignments();
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to grade submission');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-orange-100 text-orange-800';
      case 'GRADED':
        return 'bg-orange-100 text-orange-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
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

  const uniqueGrades = Array.from(
    new Set(students.map(s => s.grade).filter(Boolean))
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
      {/* Teacher Assignment Statistics */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <StatCard
            title='Total Assignments'
            value={stats.totalAssignments}
            subtitle='Created by you'
            icon='📋'
            color='blue'
          />
          <StatCard
            title='Total Submissions'
            value={stats.totalSubmissions}
            subtitle='Student responses'
            icon='📤'
            color='green'
          />
          <StatCard
            title='Graded'
            value={stats.gradedSubmissions}
            subtitle={`${stats.gradingProgress}% complete`}
            icon='✅'
            color='purple'
          />
          <StatCard
            title='Pending Grading'
            value={stats.pendingGrading}
            subtitle='Need attention'
            icon='⏳'
            color={stats.pendingGrading > 0 ? 'yellow' : 'green'}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Assignment Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className='bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors'
        >
          ➕ Create Assignment
        </button>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      {/* Assignments List */}
      <div className='space-y-4'>
        {assignments.length === 0 ? (
          <EmptyState
            icon='📋'
            title='No Assignments Created'
            description='Create your first assignment to get started!'
          />
        ) : (
          assignments.map(assignment => (
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
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(assignment.priority)}`}
                    >
                      {assignment.priority}
                    </span>
                  </div>
                  <p className='text-gray-600 mb-3'>{assignment.description}</p>
                  <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                    <span>📚 {assignment.subject}</span>
                    {assignment.grade && <span>🎓 {assignment.grade}</span>}
                    {assignment.student && (
                      <span>👨‍🎓 {assignment.student.name}</span>
                    )}
                    {assignment.dueDate && (
                      <span>
                        📅 Due:{' '}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span>📤 {assignment.submissions.length} submissions</span>
                  </div>
                </div>
              </div>

              {/* Submissions */}
              {assignment.submissions.length > 0 && (
                <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                  <h4 className='font-medium text-gray-900 mb-3'>
                    Submissions ({assignment.submissions.length})
                  </h4>
                  <div className='space-y-2'>
                    {assignment.submissions.map(submission => (
                      <div
                        key={submission.id}
                        className='flex justify-between items-center bg-white rounded-lg p-3'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center space-x-3'>
                            <span className='font-medium'>
                              {submission.student.name}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}
                            >
                              {submission.status}
                            </span>
                            {submission.grade && (
                              <span className='text-sm text-orange-600 font-medium'>
                                Grade: {submission.grade}
                              </span>
                            )}
                          </div>
                          <p className='text-sm text-gray-500'>
                            Submitted:{' '}
                            {new Date(submission.submittedAt!).toLocaleString()}
                          </p>
                        </div>
                        {submission.status !== 'GRADED' && (
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowGradingModal(true);
                            }}
                            className='bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors'
                          >
                            Grade
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Create New Assignment
            </h3>
            <form onSubmit={handleCreateAssignment} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title *
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Subject *
                  </label>
                  <input
                    type='text'
                    value={formData.subject}
                    onChange={e =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Type
                  </label>
                  <select
                    value={formData.assignmentType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        assignmentType: e.target.value
                      })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  >
                    <option value='HOMEWORK'>Homework</option>
                    <option value='PROJECT'>Project</option>
                    <option value='QUIZ'>Quiz</option>
                    <option value='EXAM'>Exam</option>
                    <option value='NOTE'>Note</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  >
                    <option value='LOW'>Low</option>
                    <option value='MEDIUM'>Medium</option>
                    <option value='HIGH'>High</option>
                    <option value='URGENT'>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Due Date
                  </label>
                  <input
                    type='datetime-local'
                    value={formData.dueDate}
                    onChange={e =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Grade (for all students in grade)
                  </label>
                  <select
                    value={formData.grade}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        grade: e.target.value,
                        studentId: ''
                      })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  >
                    <option value=''>Select Grade</option>
                    {uniqueGrades.map(grade => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Specific Student (optional)
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        studentId: e.target.value,
                        grade: ''
                      })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  >
                    <option value=''>Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.grade})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='flex space-x-3 pt-4'>
                <button
                  type='submit'
                  className='flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors'
                >
                  Create Assignment
                </button>
                <button
                  type='button'
                  onClick={() => setShowCreateForm(false)}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Grade Submission - {selectedSubmission.student.name}
            </h3>
            <form onSubmit={handleGradeSubmission} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Grade
                </label>
                <input
                  type='text'
                  value={gradingData.grade}
                  onChange={e =>
                    setGradingData({ ...gradingData, grade: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='e.g., A+, 95%, Excellent'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Feedback
                </label>
                <textarea
                  value={gradingData.feedback}
                  onChange={e =>
                    setGradingData({ ...gradingData, feedback: e.target.value })
                  }
                  rows={4}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Provide feedback to the student...'
                />
              </div>
              <div className='flex space-x-3'>
                <button
                  type='submit'
                  className='flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors'
                >
                  Submit Grade
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowGradingModal(false);
                    setSelectedSubmission(null);
                    setGradingData({ grade: '', feedback: '' });
                  }}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
