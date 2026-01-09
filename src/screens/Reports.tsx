import { useState } from 'react';
import { restaurantApi } from '../api/restaurantApi';
import { roleCheck } from '../utils/roleCheck';

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeReport, setActiveReport] = useState<'sales' | 'orders' | 'items' | 'expenses'>('sales');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAccess = roleCheck.canAccessReports();

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let data;
      switch (activeReport) {
        case 'sales':
          data = await restaurantApi.getSalesReport(startDate, endDate);
          break;
        case 'orders':
          data = await restaurantApi.getOrdersReport(startDate, endDate);
          break;
        case 'items':
          data = await restaurantApi.getItemsReport(startDate, endDate);
          break;
        case 'expenses':
          data = await restaurantApi.getExpensesReport(startDate, endDate);
          break;
      }
      setReportData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  if (!canAccess) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div className="flex space-x-2">
          <button
            onClick={() => setActiveReport('sales')}
            className={`px-4 py-2 rounded ${activeReport === 'sales' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setActiveReport('orders')}
            className={`px-4 py-2 rounded ${activeReport === 'orders' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Order Report
          </button>
          <button
            onClick={() => setActiveReport('items')}
            className={`px-4 py-2 rounded ${activeReport === 'items' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Items Report
          </button>
          <button
            onClick={() => setActiveReport('expenses')}
            className={`px-4 py-2 rounded ${activeReport === 'expenses' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Expense Report
          </button>
        </div>

      {/* Date Range Filter */}
      <div className="card">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <button onClick={fetchReport} className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Report Display */}
      {reportData && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 capitalize">{activeReport} Report</h3>
          
          {activeReport === 'sales' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-primary">₹{reportData.totalSales?.toFixed(2) || 0}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{reportData.totalOrders || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">₹{reportData.averageOrderValue?.toFixed(2) || 0}</p>
              </div>
            </div>
          )}

          {activeReport !== 'sales' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Report data will be displayed here</p>
              <pre className="mt-4 text-left bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {!reportData && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Select date range and generate report to view data</p>
        </div>
      )}
    </div>
  );
}
