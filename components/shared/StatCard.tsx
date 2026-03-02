'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo';
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  onClick
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-orange-100 text-orange-600',
    green: 'bg-orange-100 text-orange-600',
    purple: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-orange-100 text-orange-600'
  };

  const textColorClasses = {
    blue: 'text-orange-600',
    green: 'text-orange-600',
    purple: 'text-orange-700',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    indigo: 'text-orange-600'
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className={`text-3xl font-bold ${textColorClasses[color]}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className={`text-sm mt-1 ${textColorClasses[color]}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className='text-3xl'>{icon}</span>
        </div>
      </div>
    </div>
  );
}
