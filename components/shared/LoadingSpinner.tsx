'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'teal';
  text?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'blue',
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-orange-600',
    green: 'border-orange-600',
    purple: 'border-orange-700',
    teal: 'border-orange-600'
  };

  return (
    <div className='flex items-center justify-center py-12'>
      <div className='text-center'>
        <div
          className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} mx-auto`}
        ></div>
        {text && <p className='mt-4 text-gray-600'>{text}</p>}
      </div>
    </div>
  );
}
