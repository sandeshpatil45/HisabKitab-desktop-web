import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import type { Order, OrderItem, Table } from '../types/restaurant';

export default function InvoiceScreen() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const table = location.state?.table as Table | undefined;
  const tableId = id || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [aggregatedItems, setAggregatedItems] = useState<OrderItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const role = localStorage.getItem('role') || '';

  useEffect(() => {
    // Access control - only managers can view invoices
    if (role === 'STAFF') {
      alert('Access denied. Only managers can view invoices.');
      navigate('/tables');
      return;
    }

    fetchTableOrders();
  }, [tableId, role, navigate]);

  const fetchTableOrders = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getTableOrders(tableId);
      setOrders(response);

      // Aggregate items from all orders/KOTs
      const aggregated = aggregateItems(response);
      setAggregatedItems(aggregated);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      alert('Failed to fetch orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const aggregateItems = (orders: Order[]): OrderItem[] => {
    const itemMap = new Map<string, OrderItem>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.menuItemId || item.name;
        const existing = itemMap.get(key);
        
        if (existing) {
          existing.quantity += item.quantity;
          existing.total = existing.quantity * existing.price;
        } else {
          itemMap.set(key, { ...item });
        }
      });
    });

    return Array.from(itemMap.values());
  };

  const calculateBill = () => {
    const subtotal = aggregatedItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxableAmount = subtotal - discountAmount;

    // GST 5% (2.5% CGST + 2.5% SGST)
    const cgstPercentage = 2.5;
    const sgstPercentage = 2.5;
    const cgst = (taxableAmount * cgstPercentage) / 100;
    const sgst = (taxableAmount * sgstPercentage) / 100;
    const grandTotal = taxableAmount + cgst + sgst;

    return {
      subtotal,
      discountAmount,
      discountPercent,
      cgst,
      sgst,
      cgstPercentage,
      sgstPercentage,
      grandTotal,
    };
  };

  const handlePrintBill = async () => {
    if (aggregatedItems.length === 0) {
      alert('No items to bill');
      return;
    }

    if (!confirm('Generate final bill and close table?')) {
      return;
    }

    setProcessing(true);

    try {
      const billCalc = calculateBill();

      // Create invoice/bill
      await restaurantApi.createBill({
        tableId: tableId,
        tableName: table?.name || `Table ${tableId}`,
        items: aggregatedItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        discount: discountPercent,
        gstPercentage: 5,
        ...billCalc,
      });

      // Print bill (browser print dialog)
      window.print();

      // Close table
      await restaurantApi.updateTableStatus(tableId, 'FREE');

      alert('Bill generated and table closed successfully!');
      navigate('/tables');
    } catch (error: any) {
      alert('Failed to generate bill: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const billCalc = calculateBill();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Invoice - {table?.name || `Table ${tableId}`}
            </h1>
            <p className="text-gray-600 mt-1">{table?.capacity} Seats</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/tables')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handlePrintBill}
              disabled={processing || aggregatedItems.length === 0}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Print Bill & Close Table'}
            </button>
          </div>
        </div>
      </div>

      {/* Orders/KOTs Display */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Orders (KOTs)</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No orders found for this table</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-bold text-gray-800 mb-3">
                  KOT #{index + 1} - {formatTime(order.createdAt)}
                </h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Item</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Qty</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">Price</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-gray-800">{item.name}</td>
                          <td className="px-4 py-2 text-center text-gray-800">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-gray-800">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right text-gray-800">₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Summary */}
      {aggregatedItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Bill Summary</h2>

          {/* Bill Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{billCalc.subtotal.toFixed(2)}</span>
            </div>

            {/* Discount Input */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-gray-700">Discount (%):</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <span className="font-semibold text-red-600">-₹{billCalc.discountAmount.toFixed(2)}</span>
            </div>

            <div className="border-t-2 border-gray-300 my-3"></div>

            {/* GST */}
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 font-semibold">GST (5%):</p>
              <div className="flex justify-between items-center pl-4">
                <span className="text-gray-600">CGST (2.5%):</span>
                <span className="text-gray-800">₹{billCalc.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pl-4">
                <span className="text-gray-600">SGST (2.5%):</span>
                <span className="text-gray-800">₹{billCalc.sgst.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 my-3"></div>

            {/* Grand Total */}
            <div className="flex justify-between items-center text-2xl pt-2">
              <span className="font-bold text-gray-800">Grand Total:</span>
              <span className="font-bold text-green-600">₹{billCalc.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
