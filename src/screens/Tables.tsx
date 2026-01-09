import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import type { Table } from '../types/restaurant';

export default function Tables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [tableName, setTableName] = useState('');
  const [tableCapacity, setTableCapacity] = useState('4');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = user.role !== 'STAFF';

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await restaurantApi.getTables();
      
      // Backend returns: { success: true, data: [...] } or direct array
      let tablesData: Table[] = [];
      
      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray((response as any).data)) {
          tablesData = (response as any).data;
        } else if (Array.isArray(response)) {
          tablesData = response;
        }
      }
      
      setTables(tablesData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load tables');
      // Show mock data if API fails - using proper Table type
      setTables([
        { 
          id: '1', 
          name: 'T1', 
          status: 'FREE', 
          capacity: 4, 
          restaurantId: 'mock',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'T2', 
          status: 'FREE', 
          capacity: 4, 
          restaurantId: 'mock',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '3', 
          name: 'T3', 
          status: 'FREE', 
          capacity: 4, 
          restaurantId: 'mock',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '4', 
          name: 'T4', 
          status: 'FREE', 
          capacity: 4, 
          restaurantId: 'mock',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const free = tables.filter(t => t.status === 'FREE').length;
    const occupied = tables.filter(t => t.status === 'OCCUPIED').length;
    const pending = tables.filter(t => t.status === 'BILL_PENDING').length;
    return { free, occupied, pending };
  };

  const handleAddTable = async () => {
    if (!tableName.trim()) {
      alert('Please enter table name');
      return;
    }

    try {
      const newTable = await restaurantApi.createTable({
        name: tableName,
        capacity: parseInt(tableCapacity),
        status: 'FREE',
      });
      setTables([...tables, newTable]);
      setShowAddModal(false);
      setTableName('');
      setTableCapacity('4');
    } catch (err: any) {
      alert(err.message || 'Failed to add table');
    }
  };

  const { free, occupied, pending } = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Restaurant</p>
        <h1 className="text-4xl font-bold text-gray-800">Tables</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">⚠️ {error}</p>
          <p className="text-xs mt-1">Showing demo data. Please ensure backend is running.</p>
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <p className="text-4xl font-bold text-gray-800 mb-2">{free}</p>
          <p className="text-gray-600 font-medium">Free</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <p className="text-4xl font-bold text-gray-800 mb-2">{occupied}</p>
          <p className="text-gray-600 font-medium">Occupied</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-4xl font-bold text-gray-800 mb-2">{pending}</p>
          <p className="text-gray-600 font-medium">Bill Pending</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => navigate(`/billing/${table.id}`, { state: { table } })}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition-all duration-200 hover:scale-105 ${
              table.status === 'FREE' ? 'border-2 border-green-200 hover:border-green-400' :
              table.status === 'OCCUPIED' ? 'border-2 border-red-200 hover:border-red-400' :
              'border-2 border-yellow-200 hover:border-yellow-400'
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{table.name}</h3>
            <p className="text-sm text-gray-600 mb-3 flex items-center justify-center gap-1">
              <span>👥</span>
              <span>{table.capacity || 4} seats</span>
            </p>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
              table.status === 'FREE' ? 'bg-green-100 text-green-700' :
              table.status === 'OCCUPIED' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {table.status === 'FREE' ? 'Free' :
               table.status === 'OCCUPIED' ? 'Occupied' : 'Pending'}
            </span>
          </button>
        ))}
      </div>

      {/* Add Table Button (Owner only) */}
      {canManage && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110"
          title="Add New Table"
        >
          +
        </button>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Table</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Number/Name
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="e.g., T1, A1, VIP-1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (Seats)
              </label>
              <input
                type="number"
                value={tableCapacity}
                onChange={(e) => setTableCapacity(e.target.value)}
                placeholder="4"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setTableName('');
                  setTableCapacity('4');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTable}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
