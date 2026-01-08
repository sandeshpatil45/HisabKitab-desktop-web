import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TableCard from '../components/TableCard';
import { restaurantApi } from '../api/restaurantApi';
import type { Table, TableStatus } from '../types/restaurant';
import { roleCheck } from '../utils/roleCheck';
import { validation } from '../utils/validation';

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableName, setTableName] = useState('');
  const [tableCapacity, setTableCapacity] = useState('');
  const navigate = useNavigate();

  const canManage = roleCheck.isOwner();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await restaurantApi.getTables();
      setTables(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const getTableStatus = (): TableStatus => {
    const free = tables.filter(t => t.status === 'FREE').length;
    const occupied = tables.filter(t => t.status === 'OCCUPIED').length;
    const billPending = tables.filter(t => t.status === 'BILL_PENDING').length;

    return {
      free,
      occupied,
      billPending,
      total: tables.length,
    };
  };

  const handleTableClick = (table: Table) => {
    navigate(`/billing/${table.id}`, { state: { table } });
  };

  const handleAddTable = async () => {
    if (!validation.validateTableName(tableName)) {
      alert('Please enter a valid table name');
      return;
    }

    try {
      const newTable = await restaurantApi.createTable({
        name: tableName,
        capacity: tableCapacity ? parseInt(tableCapacity) : undefined,
        status: 'FREE',
      });

      setTables([...tables, newTable]);
      setShowAddModal(false);
      setTableName('');
      setTableCapacity('');
    } catch (err: any) {
      alert(err.message || 'Failed to add table');
    }
  };

  const handleEditTable = async () => {
    if (!selectedTable || !validation.validateTableName(tableName)) {
      alert('Please enter a valid table name');
      return;
    }

    try {
      const updatedTable = await restaurantApi.updateTable(selectedTable.id, {
        name: tableName,
        capacity: tableCapacity ? parseInt(tableCapacity) : undefined,
      });

      setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
      setShowEditModal(false);
      setSelectedTable(null);
      setTableName('');
      setTableCapacity('');
    } catch (err: any) {
      alert(err.message || 'Failed to update table');
    }
  };

  const handleDeleteTable = async (table: Table) => {
    if (!confirm(`Are you sure you want to delete ${table.name}?`)) {
      return;
    }

    try {
      await restaurantApi.deleteTable(table.id);
      setTables(tables.filter(t => t.id !== table.id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete table');
    }
  };

  const openEditModal = (table: Table) => {
    setSelectedTable(table);
    setTableName(table.name);
    setTableCapacity(table.capacity?.toString() || '');
    setShowEditModal(true);
  };

  const status = getTableStatus();

  return (
    <Layout title="Tables">
      <div className="space-y-6">
        {/* Status Summary */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-green-700 font-semibold">{status.free} Free</span>
            </div>
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              <span className="text-red-700 font-semibold">{status.occupied} Occupied</span>
            </div>
            <div className="bg-yellow-100 px-4 py-2 rounded-lg">
              <span className="text-yellow-700 font-semibold">{status.billPending} Bill Pending</span>
            </div>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              + Add Table
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tables...</p>
          </div>
        )}

        {/* Tables Grid */}
        {!loading && tables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tables found</p>
            {canManage && (
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                Add Your First Table
              </button>
            )}
          </div>
        )}

        {!loading && tables.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onClick={handleTableClick}
                onEdit={canManage ? openEditModal : undefined}
                onDelete={canManage ? handleDeleteTable : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Name *
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="input-field"
                  placeholder="e.g., T1, Table 1"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(e.target.value)}
                  className="input-field"
                  placeholder="Number of seats"
                  min="1"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setTableName('');
                  setTableCapacity('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleAddTable} className="flex-1 btn-primary">
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Name *
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="input-field"
                  placeholder="e.g., T1, Table 1"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(e.target.value)}
                  className="input-field"
                  placeholder="Number of seats"
                  min="1"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTable(null);
                  setTableName('');
                  setTableCapacity('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleEditTable} className="flex-1 btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tables;
