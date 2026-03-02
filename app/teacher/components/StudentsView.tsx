'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  dateOfBirth: string;
  enrollmentDate: string;
  isActive: boolean;
  family: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  subscriptions: {
    id: string;
    course?: {
      name: string;
      grade: string;
    };
    service?: {
      name: string;
    };
  }[];
  academicLogs: {
    id: string;
    title: string;
    logType: string;
    subject: string;
    createdAt: string;
  }[];
}

export default function StudentsView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const studentsData = await response.json();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.family.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === '' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const uniqueGrades = Array.from(
    new Set(students.map(student => student.grade))
  ).sort();

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

  const getLogTypeColor = (logType: string) => {
    switch (logType) {
      case 'ACHIEVEMENT':
        return 'text-orange-600';
      case 'CONCERN':
        return 'text-red-600';
      default:
        return 'text-orange-600';
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
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>My Students</h2>
        <p className='text-gray-600 mt-1'>
          View and manage student information and academic progress
        </p>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Search Students
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search by name, student ID, or family name...'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Grade
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            >
              <option value=''>All Grades</option>
              {uniqueGrades.map(grade => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer'
            onClick={() => setSelectedStudent(student)}
          >
            <div className='flex items-center space-x-4 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                {student.name.charAt(0)}
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900'>{student.name}</h3>
                <p className='text-sm text-gray-600'>{student.studentId}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${student.isActive ? 'bg-orange-400' : 'bg-gray-400'}`}
              ></div>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Grade:</span>
                <span className='font-medium'>{student.grade}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Family:</span>
                <span className='font-medium'>{student.family.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Courses:</span>
                <span className='font-medium'>
                  {student.subscriptions.filter(s => s.course).length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Academic Logs:</span>
                <span className='font-medium'>
                  {student.academicLogs?.length || 0}
                </span>
              </div>
            </div>

            {/* Recent Academic Activity */}
            {student.academicLogs && student.academicLogs.length > 0 && (
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <p className='text-xs text-gray-600 mb-2'>Recent Activity:</p>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg'>
                    {getLogTypeIcon(student.academicLogs[0].logType)}
                  </span>
                  <span
                    className={`text-xs font-medium ${getLogTypeColor(student.academicLogs[0].logType)}`}
                  >
                    {student.academicLogs[0].logType}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {new Date(
                      student.academicLogs[0].createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>👨‍🎓</span>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No Students Found
          </h3>
          <p className='text-gray-600'>
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h3 className='text-2xl font-bold text-gray-900'>
                  {selectedStudent.name}
                </h3>
                <p className='text-gray-600'>
                  {selectedStudent.studentId} • {selectedStudent.grade}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className='text-gray-400 hover:text-gray-600'
              >
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
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Student Information */}
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Student Information
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date of Birth:</span>
                      <span>
                        {new Date(
                          selectedStudent.dateOfBirth
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Enrollment Date:</span>
                      <span>
                        {new Date(
                          selectedStudent.enrollmentDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Status:</span>
                      <span
                        className={
                          selectedStudent.isActive
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }
                      >
                        {selectedStudent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Family Information
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Family Name:</span>
                      <span>{selectedStudent.family.name}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Email:</span>
                      <span>{selectedStudent.family.email}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Phone:</span>
                      <span>{selectedStudent.family.phone}</span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Enrollments
                  </h4>
                  <div className='space-y-2'>
                    {selectedStudent.subscriptions.map(subscription => (
                      <div
                        key={subscription.id}
                        className='flex items-center justify-between text-sm'
                      >
                        <span className='text-gray-700'>
                          {subscription.course?.name ||
                            subscription.service?.name}
                        </span>
                        <span className='text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded'>
                          {subscription.course ? 'Course' : 'Service'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Academic Logs */}
              <div>
                <h4 className='font-semibold text-gray-900 mb-3'>
                  Academic History
                </h4>
                <div className='space-y-3 max-h-96 overflow-y-auto'>
                  {selectedStudent.academicLogs &&
                  selectedStudent.academicLogs.length > 0 ? (
                    selectedStudent.academicLogs.map(log => (
                      <div key={log.id} className='bg-gray-50 rounded-lg p-3'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <span className='text-lg'>
                            {getLogTypeIcon(log.logType)}
                          </span>
                          <span className='font-medium text-gray-900'>
                            {log.title}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-xs text-gray-600'>
                          <span>{log.subject}</span>
                          <span>
                            {new Date(log.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      <span className='text-2xl block mb-2'>📝</span>
                      No academic logs yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
