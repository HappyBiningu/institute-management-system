'use client';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
      <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <span className='text-3xl'>{icon}</span>
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>{title}</h3>
      <p className='text-gray-600 mb-4'>{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className='bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
