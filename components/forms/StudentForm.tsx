'use client';

import { useState, useEffect } from 'react';

interface Family {
  id: string;
  name: string;
  discountAmount: number;
}

interface Student {
  id: string;
  name: string;
  surname?: string;
  idNumber?: string;
  gender?: string;
  ethnicity?: string;
  homeLanguage?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  grade?: string;
  dateOfBirth?: string;
  enrollmentDate: string;
  family: Family;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  previousSchool?: string;
  medicalConditions?: string;
  subscriptions: any[];
  _count: {
    subscriptions: number;
  };
  createdAt: string;
}

interface StudentFormProps {
  student?: Student | null;
  onSuccess: (student: Student) => void;
  onCancel: () => void;
}

export default function StudentForm({
  student,
  onSuccess,
  onCancel
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    idNumber: '',
    gender: '',
    ethnicity: '',
    homeLanguage: '',
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    grade: '',
    dateOfBirth: '',
    enrollmentDate: '',
    familyId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    previousSchool: '',
    medicalConditions: ''
  });
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilies();

    if (student) {
      setFormData({
        name: student.name,
        surname: student.surname || '',
        idNumber: student.idNumber || '',
        gender: student.gender || '',
        ethnicity: student.ethnicity || '',
        homeLanguage: student.homeLanguage || '',
        address: student.address || '',
        city: student.city || '',
        postalCode: student.postalCode || '',
        phoneNumber: student.phoneNumber || '',
        email: student.email || '',
        grade: student.grade || '',
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.split('T')[0]
          : '',
        enrollmentDate: student.enrollmentDate.split('T')[0],
        familyId: student.family.id,
        emergencyContactName: student.emergencyContactName || '',
        emergencyContactPhone: student.emergencyContactPhone || '',
        previousSchool: student.previousSchool || '',
        medicalConditions: student.medicalConditions || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        enrollmentDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [student]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = student ? `/api/students/${student.id}` : '/api/students';
      const method = student ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save student');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
            <svg className='w-5 h-5 text-red-500 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='lg:col-span-1'>
          <h4 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-4'>Personal Information</h4>
          <div className='space-y-4'>
            <div>
              <label htmlFor='name' className='block text-xs font-semibold text-gray-700 mb-1'>First Name *</label>
              <input type='text' name='name' id='name' required className='input-field' value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='surname' className='block text-xs font-semibold text-gray-700 mb-1'>Surname</label>
              <input type='text' name='surname' id='surname' className='input-field' value={formData.surname} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='idNumber' className='block text-xs font-semibold text-gray-700 mb-1'>ID/Passport Number</label>
              <input type='text' name='idNumber' id='idNumber' className='input-field' value={formData.idNumber} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='gender' className='block text-xs font-semibold text-gray-700 mb-1'>Gender</label>
              <select name='gender' id='gender' className='input-field' value={formData.gender} onChange={handleChange}>
                <option value=''>Select Gender</option>
                <option value='MALE'>Male</option>
                <option value='FEMALE'>Female</option>
                <option value='OTHER'>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className='lg:col-span-1'>
          <h4 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-4'>Contact Information</h4>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-xs font-semibold text-gray-700 mb-1'>Email Address</label>
              <input type='email' name='email' id='email' className='input-field' value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='phoneNumber' className='block text-xs font-semibold text-gray-700 mb-1'>Phone Number</label>
              <input type='text' name='phoneNumber' id='phoneNumber' className='input-field' value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='address' className='block text-xs font-semibold text-gray-700 mb-1'>Residential Address</label>
              <input type='text' name='address' id='address' className='input-field' value={formData.address} onChange={handleChange} />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label htmlFor='city' className='block text-xs font-semibold text-gray-700 mb-1'>City</label>
                <input type='text' name='city' id='city' className='input-field' value={formData.city} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor='postalCode' className='block text-xs font-semibold text-gray-700 mb-1'>Postal Code</label>
                <input type='text' name='postalCode' id='postalCode' className='input-field' value={formData.postalCode} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-1'>
          <h4 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-4'>Academic & Family</h4>
          <div className='space-y-4'>
            <div>
              <label htmlFor='familyId' className='block text-xs font-semibold text-gray-700 mb-1'>Family *</label>
              <select name='familyId' id='familyId' required className='input-field' value={formData.familyId} onChange={handleChange}>
                <option value=''>Select a family</option>
                {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor='grade' className='block text-xs font-semibold text-gray-700 mb-1'>Course/Grade</label>
              <input type='text' name='grade' id='grade' className='input-field' value={formData.grade} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='enrollmentDate' className='block text-xs font-semibold text-gray-700 mb-1'>Enrollment Date *</label>
              <input type='date' name='enrollmentDate' id='enrollmentDate' required className='input-field' value={formData.enrollmentDate} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='previousSchool' className='block text-xs font-semibold text-gray-700 mb-1'>Previous School</label>
              <input type='text' name='previousSchool' id='previousSchool' className='input-field' value={formData.previousSchool} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div>
          <h4 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-4'>Emergency & Medical</h4>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label htmlFor='emergencyContactName' className='block text-xs font-semibold text-gray-700 mb-1'>Emergency Contact</label>
                <input type='text' name='emergencyContactName' id='emergencyContactName' className='input-field' value={formData.emergencyContactName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor='emergencyContactPhone' className='block text-xs font-semibold text-gray-700 mb-1'>Emergency Phone</label>
                <input type='text' name='emergencyContactPhone' id='emergencyContactPhone' className='input-field' value={formData.emergencyContactPhone} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label htmlFor='medicalConditions' className='block text-xs font-semibold text-gray-700 mb-1'>Medical Conditions</label>
              <textarea name='medicalConditions' id='medicalConditions' className='input-field min-h-[80px]' value={formData.medicalConditions} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-end space-x-4 pt-6'>
        <button type='button' onClick={onCancel} className='btn-secondary' disabled={loading}>Cancel</button>
        <button type='submit' className='btn-primary' disabled={loading}>
          {loading ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
        </button>
      </div>
    </form>
  );
}
