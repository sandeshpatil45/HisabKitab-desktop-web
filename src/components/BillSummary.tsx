import React from 'react';
import { roleCheck } from '../utils/roleCheck';

interface BillSummaryProps {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  cgst: number;
  sgst: number;
  cgstPercentage: number;
  sgstPercentage: number;
  grandTotal: number;
}

const BillSummary: React.FC<BillSummaryProps> = ({
  subtotal,
  discountPercentage,
  discountAmount,
  cgst,
  sgst,
  cgstPercentage,
  sgstPercentage,
  grandTotal,
}) => {
  const canSeePrices = roleCheck.canSeePrices();

  if (!canSeePrices) {
    return null;
  }

  return (
    <div className="card bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Bill Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        {discountPercentage > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Discount ({discountPercentage}%)</span>
            <span className="font-medium">- ₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between text-gray-700 text-sm">
            <span>CGST ({cgstPercentage}%)</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm mt-1">
            <span>SGST ({sgstPercentage}%)</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Grand Total</span>
            <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillSummary;
