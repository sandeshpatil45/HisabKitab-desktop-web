import React, { useState, useEffect } from 'react';
import { restaurantApi } from '../api/restaurantApi';
import type { MenuItem } from '../types/restaurant';
import { roleCheck } from '../utils/roleCheck';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canManage = roleCheck.canManageMenu();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await restaurantApi.getMenu();
      setMenuItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {canManage && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage your restaurant menu items</p>
          <button className="btn-primary">+ Add Menu Item</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading menu...</p>
        </div>
      )}

      {!loading && menuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No menu items found</p>
        </div>
      )}

      {!loading && menuItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">₹{item.price}</span>
                {canManage && (
                  <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
