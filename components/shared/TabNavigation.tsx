'use client';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  color?: 'blue' | 'green' | 'purple' | 'teal';
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  color = 'blue'
}: TabNavigationProps) {
  const colorClasses = {
    blue: 'border-orange-500 text-orange-600',
    green: 'border-orange-500 text-orange-600',
    purple: 'border-orange-500 text-orange-700',
    teal: 'border-orange-500 text-orange-600'
  };

  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <nav className='flex space-x-8'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? colorClasses[color]
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className='mr-2'>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
