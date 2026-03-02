'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

interface SearchFilters {
  query: string;
  type: 'all' | 'students' | 'families' | 'users';
  status: 'all' | 'active' | 'inactive';
  dateRange: 'all' | 'week' | 'month' | 'year';
}

interface SearchResult {
  id: string;
  type: 'student' | 'family' | 'user';
  name: string;
  email?: string;
  status: string;
  details: string;
  href: string;
}

export default function PeopleSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        q: filters.query,
        type: filters.type,
        status: filters.status,
        dateRange: filters.dateRange
      });

      const response = await fetch(`/api/people/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        // Try to parse error response for more specific feedback
        try {
          const errorData = await response.json();
          console.error(
            'Search failed:',
            errorData.message || `HTTP ${response.status}`
          );
        } catch {
          console.error('Search failed:', `HTTP ${response.status}`);
        }
        setResults([]);
      }
    } catch (error) {
      // Provide more specific error logging
      if (error instanceof Error) {
        console.error('Search network error:', error.message);
      } else {
        console.error('Search error: Unable to connect to server');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return '👨‍🎓';
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'user':
        return '👤';
      default:
        return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-orange-100 text-orange-800';
      case 'family':
        return 'bg-orange-100 text-orange-800';
      case 'user':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex justify-between items-center animate-fade-in'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              Advanced People Search
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Search across students, families, and users with advanced filters
            </p>
          </div>
          <Link
            href='/admin/people'
            className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            ← Back to People Hub
          </Link>
        </div>

        {/* Search Form */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Search Filters
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Search Query */}
            <div className='lg:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search Query
              </label>
              <input
                type='text'
                value={filters.query}
                onChange={e => handleFilterChange('query', e.target.value)}
                placeholder='Enter name, email, or ID...'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Type
              </label>
              <select
                value={filters.type}
                onChange={e => handleFilterChange('type', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              >
                <option value='all'>All Types</option>
                <option value='students'>Students</option>
                <option value='families'>Families</option>
                <option value='users'>Users</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Status
              </label>
              <select
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Date Range
            </label>
            <div className='flex space-x-4'>
              {[
                { value: 'all', label: 'All Time' },
                { value: 'week', label: 'Last Week' },
                { value: 'month', label: 'Last Month' },
                { value: 'year', label: 'Last Year' }
              ].map(option => (
                <label key={option.value} className='flex items-center'>
                  <input
                    type='radio'
                    name='dateRange'
                    value={option.value}
                    checked={filters.dateRange === option.value}
                    onChange={e =>
                      handleFilterChange('dateRange', e.target.value)
                    }
                    className='mr-2'
                  />
                  <span className='text-sm text-gray-700'>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className='mt-6'>
            <button
              onClick={handleSearch}
              disabled={loading}
              className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
            >
              {loading ? (
                <div className='flex items-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Searching...
                </div>
              ) : (
                '🔍 Search People'
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Search Results {results.length > 0 && `(${results.length})`}
            </h2>

            {loading ? (
              <div className='text-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4'></div>
                <p className='text-gray-500'>Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <div className='text-center py-8'>
                <div className='text-gray-400 text-4xl mb-4'>🔍</div>
                <p className='text-gray-500'>No results found</p>
                <p className='text-sm text-gray-400 mt-2'>
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {results.map(result => (
                  <div
                    key={result.id}
                    className='flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='text-2xl'>{getTypeIcon(result.type)}</div>
                      <div>
                        <div className='flex items-center space-x-2'>
                          <h3 className='font-semibold text-gray-900'>
                            {result.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}
                          >
                            {result.type}
                          </span>
                        </div>
                        {result.email && (
                          <p className='text-sm text-gray-600'>
                            {result.email}
                          </p>
                        )}
                        <p className='text-sm text-gray-500'>
                          {result.details}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.status === 'active'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {result.status}
                      </span>
                      <Link
                        href={result.href}
                        className='text-orange-600 hover:text-orange-800 text-sm font-medium'
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        <div className='bg-orange-50 rounded-2xl border border-orange-200 p-6'>
          <h3 className='text-lg font-semibold text-orange-900 mb-3'>
            Search Tips
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800'>
            <div>
              <h4 className='font-medium mb-2'>Search by:</h4>
              <ul className='space-y-1'>
                <li>• Full or partial names</li>
                <li>• Email addresses</li>
                <li>• Student or family IDs</li>
                <li>• Phone numbers</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Filter options:</h4>
              <ul className='space-y-1'>
                <li>• Type: Students, Families, or Users</li>
                <li>• Status: Active or Inactive</li>
                <li>• Date: Recent registrations</li>
                <li>• Combine multiple filters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
