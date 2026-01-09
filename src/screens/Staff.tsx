import { useState, useEffect } from 'react';
import { restaurantApi } from '../api/restaurantApi';
import type { Staff } from '../types/restaurant';
import { roleCheck } from '../utils/roleCheck';

export default function StaffScreen() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canManage = roleCheck.canManageStaff();

  useEffect(() => {
    if (canManage) {
      fetchStaff();
    }
  }, [canManage]);

  const fetchStaff = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await restaurantApi.getStaff();
      setStaff(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  if (!canManage) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your restaurant staff</p>
        <button className="btn-primary">+ Add Staff Member</button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading staff...</p>
        </div>
      )}

      {!loading && staff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No staff members found</p>
        </div>
      )}

      {!loading && staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">@{member.username}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${member.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {member.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Role: {member.role}</p>
              <p className="text-sm text-gray-600 mb-3">Mobile: {member.mobile}</p>
              <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
