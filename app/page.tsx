'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage and cookie
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Also set as httpOnly cookie for server-side access
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

        // Redirect based on role
        switch (data.user.role) {
          case 'ADMIN':
            router.push('/admin/dashboard');
            break;
          case 'TEACHER':
            router.push('/teacher/dashboard');
            break;
          case 'PARENT':
            router.push('/parent/dashboard');
            break;
          case 'STUDENT':
            router.push('/student/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-orange-700/20 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-orange-600/20 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-md w-full space-y-8 relative z-10 animate-fade-in'>
        <div className='text-center'>
          <div className='mx-auto mb-6'>
            <img src='/logo.webp' alt='Rand Training College' className='h-24 w-auto mx-auto' />
          </div>
          <h2 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Welcome Back
          </h2>
          <p className='mt-3 text-gray-600 font-medium'>
            Sign in to Rand Training College System
          </p>
        </div>
        <div className='card animate-slide-up'>
          <form className='space-y-6' onSubmit={handleLogin}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-semibold text-gray-700 mb-2'
                >
                  Email Address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='input-field'
                  placeholder='Enter your email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-semibold text-gray-700 mb-2'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='input-field'
                  placeholder='Enter your password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm'>
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className='text-center'>
              <a
                href='/forgot-password'
                className='text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors duration-200'
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
