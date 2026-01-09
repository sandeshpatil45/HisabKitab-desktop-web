import React, { useState } from 'react';
import { validation } from '../utils/validation';
import { roleCheck } from '../utils/roleCheck';

const OrderRolls: React.FC = () => {
  const [printerType, setPrinterType] = useState<'58mm' | '80mm'>('80mm');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canAccess = roleCheck.canManageBilling();

  const handleOrder = () => {
    setError('');
    setSuccess('');

    if (!validation.validateOrderRollsQuantity(quantity)) {
      setError('Minimum quantity is 20 rolls');
      return;
    }

    // Simulate order placement
    setSuccess(`Order placed successfully for ${quantity} rolls of ${printerType} paper!`);
    setQuantity('');
  };

  if (!canAccess) {
    return (
    <div className="text-center py-12">
      <p className="text-gray-500">You don't have permission to access this page.</p>
    </div>
  );
  }

  return (
  <div className="max-w-2xl mx-auto">
    <div className="card space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Order Printer Rolls</h2>
          <p className="text-gray-600">Order thermal paper rolls for your printer</p>
        </div>

        {/* Educational Note */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800 mb-1">
            <strong>Recommended:</strong> Order 3 months stock together
          </p>
          <p className="text-sm text-blue-700">
            सुचना: ३ महिने वापरासाठी एकाच वेळी रोल्स साठा करून ठेवा
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Printer Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Printer Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="58mm"
                checked={printerType === '58mm'}
                onChange={(e) => setPrinterType(e.target.value as '58mm' | '80mm')}
                className="w-4 h-4 text-primary"
              />
              <span>58mm</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="80mm"
                checked={printerType === '80mm'}
                onChange={(e) => setPrinterType(e.target.value as '58mm' | '80mm')}
                className="w-4 h-4 text-primary"
              />
              <span>80mm</span>
            </label>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (Minimum: 20 rolls)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
            placeholder="Enter quantity"
            min="20"
          />
          {quantity && parseInt(quantity) < 20 && (
            <p className="text-red-600 text-sm mt-1">Minimum quantity is 20 rolls</p>
          )}
        </div>

        {/* Order Button */}
        <button
          onClick={handleOrder}
          className="w-full btn-primary py-3 text-lg"
          disabled={!quantity || parseInt(quantity) < 20}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderRolls;
