import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantApi } from '../../api/restaurantApi';

interface MenuRow {
  id: string;
  itemName: string;
  price: string;
  category: string;
  isVeg: boolean;
}

const DEFAULT_CATEGORIES = [
  'Starters',
  'Main Course',
  'Breads',
  'Beverages',
  'Desserts',
];

const MAX_MENU_ROWS = 50;
const MIN_MENU_ROWS = 1;

export default function BulkMenuAddScreen() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MenuRow[]>([
    { id: '1', itemName: '', price: '', category: '', isVeg: true },
  ]);
  const [categories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddRow = () => {
    if (rows.length >= MAX_MENU_ROWS) {
      alert(`Maximum ${MAX_MENU_ROWS} items allowed`);
      return;
    }
    setRows([...rows, { id: Date.now().toString(), itemName: '', price: '', category: '', isVeg: true }]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length === MIN_MENU_ROWS) {
      alert('At least one row is required');
      return;
    }
    setRows(rows.filter(row => row.id !== id));
  };

  const handleRowChange = (id: string, field: keyof MenuRow, value: string | boolean) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleSkip = () => {
    navigate('/onboarding/subscription');
  };

  const validateRows = () => {
    const validRows = rows.filter(r => r.itemName.trim() && r.price && r.category);
    
    for (const row of validRows) {
      if (row.itemName.trim().length < 2) {
        setError(`Item name "${row.itemName}" is too short (minimum 2 characters)`);
        return null;
      }
      
      const priceNum = parseFloat(row.price);
      if (isNaN(priceNum) || priceNum < 0) {
        setError(`Invalid price for "${row.itemName}"`);
        return null;
      }
      
      if (!row.category) {
        setError(`Category is required for "${row.itemName}"`);
        return null;
      }
    }
    
    return validRows;
  };

  const handleSave = async () => {
    setError('');

    const validRows = validateRows();
    
    if (!validRows) {
      return;
    }

    if (validRows.length === 0) {
      setError('Please add at least one valid menu item');
      return;
    }

    setLoading(true);

    try {
      // Save to backend
      await restaurantApi.bulkAddMenu(
        validRows.map(r => ({
          name: r.itemName.trim(),
          price: parseFloat(r.price),
          category: r.category,
          isVeg: r.isVeg,
          available: true,
          gstPercentage: 5,
        }))
      );

      // Navigate to next step
      navigate('/onboarding/subscription');
    } catch (err: any) {
      setError(err.message || 'Failed to save menu items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Menu Setup</h2>
      <p className="text-gray-600 mb-6">Add your menu items (optional, you can add more later)</p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Desktop Table Format */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Item Name <span className="text-red-500">*</span>
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Price (₹) <span className="text-red-500">*</span>
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Veg/Non-veg
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {/* Item Name */}
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="text"
                    value={row.itemName}
                    onChange={(e) => handleRowChange(row.id, 'itemName', e.target.value)}
                    placeholder="e.g., Butter Chicken"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  />
                </td>

                {/* Price */}
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => handleRowChange(row.id, 'price', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  />
                </td>

                {/* Category */}
                <td className="border border-gray-300 px-2 py-2">
                  <select
                    value={row.category}
                    onChange={(e) => handleRowChange(row.id, 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Veg/Non-veg Toggle */}
                <td className="border border-gray-300 px-2 py-2">
                  <button
                    onClick={() => handleRowChange(row.id, 'isVeg', !row.isVeg)}
                    disabled={loading}
                    className={`w-full px-3 py-2 rounded font-medium transition-colors ${
                      row.isVeg
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {row.isVeg ? '🟢 Veg' : '🔴 Non-veg'}
                  </button>
                </td>

                {/* Actions */}
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <button
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={loading || rows.length === 1}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <button
        onClick={handleAddRow}
        disabled={loading || rows.length >= MAX_MENU_ROWS}
        className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add Row
      </button>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSkip}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Skip
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}
