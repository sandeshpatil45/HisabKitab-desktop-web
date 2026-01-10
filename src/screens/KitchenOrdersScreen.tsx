import { useState, useEffect } from 'react';
import { restaurantApi } from '../api/restaurantApi';

interface KitchenOrder {
  id: string | number;
  tableId: string;
  tableName: string;
  items: { name: string; quantity: number }[];
  status: string;
  createdAt: string;
  kotNumber?: string;
}

type OrderStatus = 'all' | 'new' | 'preparing' | 'ready';

export default function KitchenOrdersScreen() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadKitchenOrders();
  }, [activeTab]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadKitchenOrders();
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [activeTab, autoRefresh]);

  const loadKitchenOrders = async () => {
    try {
      setLoading(true);
      const response = await restaurantApi.getKitchenOrders();
      const ordersData = (response as any)?.data || response;
      
      let filteredOrders = Array.isArray(ordersData) ? ordersData : [];
      
      // Filter by status if not 'all'
      if (activeTab !== 'all') {
        filteredOrders = filteredOrders.filter((order: KitchenOrder) => 
          order.status.toLowerCase() === activeTab
        );
      }
      
      setOrders(filteredOrders);
    } catch (err: any) {
      console.error('Failed to fetch kitchen orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPreparing = async (orderId: string | number) => {
    try {
      await restaurantApi.updateOrderStatus(String(orderId), 'PREPARING');
      await loadKitchenOrders(); // Refresh
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const handleMarkReady = async (orderId: string | number) => {
    try {
      await restaurantApi.updateOrderStatus(String(orderId), 'READY');
      await loadKitchenOrders(); // Refresh
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'NEW':
      case 'PENDING':
        return { color: 'bg-red-500 text-white', label: 'NEW', icon: '🔴' };
      case 'PREPARING':
        return { color: 'bg-orange-500 text-white', label: 'PREPARING', icon: '🟠' };
      case 'READY':
        return { color: 'bg-green-500 text-white', label: 'READY', icon: '🟢' };
      default:
        return { color: 'bg-gray-500 text-white', label: upperStatus, icon: '⚪' };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">Kitchen</p>
          <h1 className="text-4xl font-bold text-gray-800">Kitchen Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">🔄 Auto-refresh</span>
          </label>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 flex gap-2 bg-white rounded-xl shadow-md p-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'new'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setActiveTab('preparing')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'preparing'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Preparing
        </button>
        <button
          onClick={() => setActiveTab('ready')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'ready'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ready
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Orders Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">{order.tableName}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${badge.color}`}>
                    {badge.icon} {badge.label}
                  </span>
                </div>

                {/* Timestamp */}
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                  <span>⏰</span>
                  <span>{formatTime(order.createdAt)}</span>
                </div>

                {/* Items List */}
                <div className="mb-4 space-y-2">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="text-gray-700">
                      • <span className="font-semibold">{item.name}</span> x{item.quantity}
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <p className="text-gray-500 text-sm">No items</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status.toUpperCase() === 'NEW' && (
                    <>
                      <button
                        onClick={() => handleMarkPreparing(order.id)}
                        className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Mark Preparing
                      </button>
                      <button
                        onClick={() => handleMarkReady(order.id)}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Mark Ready
                      </button>
                    </>
                  )}
                  {order.status.toUpperCase() === 'PREPARING' && (
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status.toUpperCase() === 'READY' && (
                    <div className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-center">
                      ✓ Ready to Serve
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders</h3>
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? 'No orders in the kitchen right now.'
              : `No ${activeTab} orders at the moment.`}
          </p>
        </div>
      )}
    </div>
  );
}
