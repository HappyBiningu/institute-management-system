'use client';

interface FamilyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  discountAmount: number;
  children: {
    id: string;
    name: string;
    grade: string;
    studentId: string;
  }[];
}

interface FamilyOverviewProps {
  familyProfile: FamilyProfile | null;
}

export default function FamilyOverview({ familyProfile }: FamilyOverviewProps) {
  if (!familyProfile) {
    return (
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <div className='text-center py-8'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>👨‍👩‍👧‍👦</span>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Family Profile Loading
          </h3>
          <p className='text-gray-600'>
            Please wait while we load your family information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-6'>
        👨‍👩‍👧‍👦 Family Profile
      </h3>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Family Information */}
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium text-gray-900 mb-3'>
              Family Information
            </h4>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Family Name:</span>
                <span className='font-medium'>{familyProfile.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Email:</span>
                <span className='font-medium'>{familyProfile.email}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Phone:</span>
                <span className='font-medium'>{familyProfile.phone}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Address:</span>
                <span className='font-medium text-right max-w-xs'>
                  {familyProfile.address}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Family Discount:</span>
                <span className='font-medium text-orange-600'>
                  ₹{familyProfile.discountAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium text-gray-900 mb-3'>
              Children ({familyProfile.children.length})
            </h4>
            <div className='space-y-3'>
              {familyProfile.children.map(child => (
                <div
                  key={child.id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {child.name}
                      </div>
                      <div className='text-sm text-gray-600'>{child.grade}</div>
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>{child.studentId}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
