import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { restaurantApi } from '../api/restaurantApi';
import type { Invoice } from '../types';
import { roleCheck } from '../utils/roleCheck';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const canAccess = roleCheck.canManageBilling();

  useEffect(() => {
    if (canAccess) {
      fetchInvoices();
    }
  }, [canAccess]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await restaurantApi.getBills();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!canAccess) {
    return (
      <Layout title="Invoices">
        <div className="text-center py-12">
          <p className="text-gray-500">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Invoices">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-96"
            placeholder="Search by invoice number or customer name..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        )}

        {!loading && filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No invoices found</p>
          </div>
        )}

        {!loading && filteredInvoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.tableName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.customerName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{invoice.grandTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        invoice.status === 'FINALIZED' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      <button className="text-primary hover:text-green-700">Print</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Invoices;
