'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@randtrainingcollege.com',
          password: 'admin123'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(
          `✅ Login successful! Token: ${data.token.substring(0, 20)}...`
        );
      } else {
        setResult(`❌ Login failed: ${data.error}`);
      }
    } catch (error) {
      setResult(
        `❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testCourses = async () => {
    setLoading(true);
    setResult('');

    try {
      // First login to get token
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@randtrainingcollege.com',
          password: 'admin123'
        })
      });

      if (!authResponse.ok) {
        setResult('❌ Authentication failed');
        return;
      }

      const authData = await authResponse.json();
      const token = authData.token;

      // Now test courses API
      const coursesResponse = await fetch('/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (coursesResponse.ok) {
        const courses = await coursesResponse.json();
        setResult(`✅ Courses API working! Found ${courses.length} courses`);
      } else {
        setResult('❌ Courses API failed');
      }
    } catch (error) {
      setResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen gradient-bg py-12 px-4'>
      <div className='max-w-md mx-auto card animate-fade-in'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-8'>
          API Test Page
        </h1>

        <div className='space-y-4'>
          <button
            onClick={testLogin}
            disabled={loading}
            className='btn-primary w-full disabled:opacity-50'
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Testing...
              </div>
            ) : (
              'Test Login API'
            )}
          </button>

          <button
            onClick={testCourses}
            disabled={loading}
            className='btn-success w-full disabled:opacity-50'
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Testing...
              </div>
            ) : (
              'Test Courses API'
            )}
          </button>

          <a href='/' className='btn-secondary w-full text-center block'>
            Go to Login Page
          </a>
        </div>

        {result && (
          <div className='mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 animate-slide-up'>
            <h3 className='font-bold text-gray-900 mb-3'>Result:</h3>
            <p className='text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded-lg'>
              {result}
            </p>
          </div>
        )}

        <div className='mt-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200'>
          <h3 className='font-bold text-gray-900 mb-3'>Test Credentials:</h3>
          <div className='space-y-1 text-sm'>
            <p>
              <span className='font-semibold'>Email:</span>{' '}
              admin@randtrainingcollege.com
            </p>
            <p>
              <span className='font-semibold'>Password:</span> admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
