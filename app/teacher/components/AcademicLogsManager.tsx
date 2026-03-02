'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  family: {
    name: string;
  };
}

interface AcademicLog {
  id: string;
  title: string;
  content: string;
  logType: 'ACHIEVEMENT' | 'PROGRESS' | 'CONCERN';
  subject: string;
  isPrivate: boolean;
  createdAt: string;
  student: Student;
}

export default function AcademicLogsManager() {
  const [logs, setLogs] = useState<AcademicLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    logType: 'PROGRESS' as 'ACHIEVEMENT' | 'PROGRESS' | 'CONCERN',
    subject: '',
    isPrivate: false,
    studentId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [logsRes, studentsRes] = await Promise.all([
        fetch('/api/academic-logs', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/students', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        console.log('Academic logs data:', logsData);
        setLogs(logsData);
      } else {
        console.error('Failed to fetch academic logs:', await logsRes.text());
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        console.log('Students data:', studentsData);
        setStudents(studentsData);
      } else {
        console.error('Failed to fetch students:', await studentsRes.text());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch('/api/academic-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          teacherId: user?.id // Add teacher ID from logged-in user
        })
      });

      if (response.ok) {
        const newLog = await response.json();
        console.log('Created academic log:', newLog);
        setShowCreateForm(false);
        setFormData({
          title: '',
          content: '',
          logType: 'PROGRESS',
          subject: '',
          isPrivate: false,
          studentId: ''
        });
        fetchData(); // Refresh the logs
      } else {
        const errorData = await response.text();
        console.error('Failed to create academic log:', errorData);
        alert('Failed to create academic log. Please try again.');
      }
    } catch (error) {
      console.error('Error creating academic log:', error);
    }
  };

  const getLogTypeColor = (logType: string) => {
    switch (logType) {
      case 'ACHIEVEMENT':
        return 'bg-orange-100 text-orange-800';
      case 'CONCERN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getLogTypeIcon = (logType: string) => {
    switch (logType) {
      case 'ACHIEVEMENT':
        return '🏆';
      case 'CONCERN':
        return '⚠️';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Academic Logs Management
          </h2>
          <p className='text-gray-600 mt-1'>
            Track student progress, achievements, and areas of concern
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className='bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors'
        >
          + Create New Log
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Create Academic Log
            </h3>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Student
                </label>
                <select
                  value={formData.studentId}
                  onChange={e =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  required
                >
                  <option value=''>Select a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.grade}) -{' '}
                      {student.family?.name || 'Unknown Family'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Title
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter log title'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Log Type
                  </label>
                  <select
                    value={formData.logType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        logType: e.target.value as any
                      })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  >
                    <option value='PROGRESS'>Progress Update</option>
                    <option value='ACHIEVEMENT'>Achievement</option>
                    <option value='CONCERN'>Concern</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Subject
                  </label>
                  <input
                    type='text'
                    value={formData.subject}
                    onChange={e =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    placeholder='e.g., Mathematics, Science'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={e =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder="Describe the student's progress, achievement, or concern..."
                  required
                />
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isPrivate'
                  checked={formData.isPrivate}
                  onChange={e =>
                    setFormData({ ...formData, isPrivate: e.target.checked })
                  }
                  className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='isPrivate'
                  className='ml-2 block text-sm text-gray-700'
                >
                  Private log (only visible to teachers and admin)
                </label>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowCreateForm(false)}
                  className='px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
                >
                  Create Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs List */}
      <div className='space-y-4'>
        {logs.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>📝</span>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No Academic Logs Yet
            </h3>
            <p className='text-gray-600 mb-4'>
              Start creating logs to track student progress and achievements.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className='bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors'
            >
              Create First Log
            </button>
          </div>
        ) : (
          logs.map(log => (
            <div
              key={log.id}
              className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <span className='text-2xl'>
                      {getLogTypeIcon(log.logType)}
                    </span>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {log.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getLogTypeColor(log.logType)}`}
                    >
                      {log.logType}
                    </span>
                    {log.isPrivate && (
                      <span className='px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full'>
                        🔒 Private
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>
                    <strong>{log.student.name}</strong> ({log.student.grade}) -{' '}
                    {log.student.family?.name || 'Unknown Family'}
                  </p>
                  <p className='text-sm text-gray-600 mb-3'>
                    Subject: <strong>{log.subject}</strong>
                  </p>
                </div>
                <span className='text-sm text-gray-500'>
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-gray-700'>{log.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
