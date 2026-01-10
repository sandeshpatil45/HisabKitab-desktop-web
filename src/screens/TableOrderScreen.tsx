import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import type { MenuItem, OrderItem, Table } from '../types/restaurant';

interface KOTDisplay {
  id: string | number;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  timestamp: string;
}

export default function TableOrderScreen() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const table = location.state?.table as Table | undefined;
  const tableId = id || '';

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);

  // Menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Current order
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);

  // Sent KOTs
  const [sentToKitchen, setSentToKitchen] = useState<KOTDisplay[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMenuItems();
    loadTableOrders();
  }, [tableId]);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const menuData = await restaurantApi.getMenu();
      setMenuItems(menuData);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(menuData.map(item => item.category)));
      setCategories(['All', ...uniqueCategories]);
    } catch (err: any) {
      console.error('Failed to fetch menu:', err);
      alert('Failed to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTableOrders = async () => {
    try {
      const response = await restaurantApi.getTableOrders(tableId);
      const ordersData = (response as any)?.data || response;
      
      if (Array.isArray(ordersData)) {
        const kots: KOTDisplay[] = ordersData.map((order: any) => ({
          id: order.id,
          orderNumber: order.kotNumber || order.id,
          status: order.status || 'NEW',
          items: order.items || [],
          timestamp: order.createdAt || new Date().toISOString(),
        }));
        setSentToKitchen(kots);
      }
    } catch (err: any) {
      console.error('Failed to fetch existing orders:', err);
      // Don't alert - table might not have orders yet
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = (item: MenuItem) => {
    const existing = currentOrder.find(i => i.menuItemId === item.id);
    if (existing) {
      setCurrentOrder(
        currentOrder.map(i =>
          i.menuItemId === item.id 
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } 
            : i
        )
      );
    } else {
      setCurrentOrder([
        ...currentOrder,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          total: item.price,
        },
      ]);
    }
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCurrentOrder(
      currentOrder
        .map(item => {
          if (item.menuItemId === menuItemId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity, total: newQuantity * item.price };
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeItem = (menuItemId: string) => {
    setCurrentOrder(currentOrder.filter(item => item.menuItemId !== menuItemId));
  };

  const calculateSubtotal = () => {
    return currentOrder.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const gstAmount = (afterDiscount * gstPercent) / 100;
    return afterDiscount + gstAmount;
  };

  const handleSendToKitchen = async () => {
    if (currentOrder.length === 0) {
      alert('Please add items first');
      return;
    }

    setSending(true);

    try {
      await restaurantApi.createOrder({
        tableId: tableId,
        items: currentOrder.map(item => ({
          menuItemId: item.menuItemId!,
          quantity: item.quantity,
        })),
      });

      alert('Order sent to kitchen!');

      // Refresh sent orders
      await loadTableOrders();

      // Clear current order (ready for next KOT)
      setCurrentOrder([]);
      setDiscountPercent(0);
      setGstPercent(0);

      // Table stays open - do NOT close
    } catch (error: any) {
      alert(error.message || 'Failed to send order');
    } finally {
      setSending(false);
    }
  };

  const handleDirectBill = async () => {
    if (currentOrder.length === 0) {
      alert('Please add items first');
      return;
    }

    // Send KOT silently, then navigate to invoice
    await handleSendToKitchen();
    navigate(`/tables/${tableId}/invoice`);
  };

  const handlePreviewBill = () => {
    navigate(`/tables/${tableId}/invoice`);
  };

  const getItemQuantityInOrder = (itemId: string) => {
    const item = currentOrder.find(i => i.menuItemId === itemId);
    return item ? item.quantity : 0;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW':
      case 'PENDING':
        return 'bg-red-100 text-red-700';
      case 'PREPARING':
        return 'bg-orange-100 text-orange-700';
      case 'READY':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {table?.name || `Table ${tableId}`}
          </h1>
          <p className="text-sm text-gray-600">Restaurant POS</p>
        </div>
        <button
          onClick={() => navigate('/tables')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
        >
          ← Back to Tables
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Customer Info Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <button
              onClick={() => setShowCustomerInfo(!showCustomerInfo)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h2 className="text-lg font-bold text-gray-800">CUSTOMER INFO</h2>
              <span className="text-gray-600">{showCustomerInfo ? '▼' : '▶'}</span>
            </button>
            {showCustomerInfo && (
              <div className="px-6 py-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={customerWhatsApp}
                    onChange={(e) => setCustomerWhatsApp(e.target.value)}
                    placeholder="WhatsApp number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Menu Items Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">MENU ITEMS</h2>
            
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => {
                const quantityInOrder = getItemQuantityInOrder(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="relative border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all text-left"
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    {!item.image && (
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-green-600 font-bold">₹{item.price.toFixed(2)}</p>
                    <span className="text-xs text-gray-500 uppercase">{item.category}</span>
                    
                    {quantityInOrder > 0 && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                        {quantityInOrder}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <p className="text-center text-gray-500 py-8">No items found</p>
            )}
          </div>

          {/* Current Order Section */}
          {currentOrder.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                CURRENT ORDER ({currentOrder.length} items)
              </h2>

              <div className="space-y-3 mb-6">
                {currentOrder.map(item => (
                  <div key={item.menuItemId} className="flex items-center justify-between border-b pb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menuItemId!, -1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-gray-800 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId!, 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-gray-800 w-24 text-right">
                        ₹{item.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.menuItemId!)}
                        className="px-3 py-1 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">BILLING</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-bold text-gray-800">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Discount:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                        min="0"
                        max="100"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">GST %:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={gstPercent}
                        onChange={(e) => setGstPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                        min="0"
                        max="100"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-green-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSendToKitchen}
                    disabled={sending}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>🧾</span>
                    <span>{sending ? 'Sending...' : 'Send to Kitchen'}</span>
                  </button>
                  <button
                    onClick={handleDirectBill}
                    disabled={sending}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>👁️</span>
                    <span>Direct Bill</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sent to Kitchen Section */}
          {sentToKitchen.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">SENT TO KITCHEN</h2>
              
              <div className="space-y-3">
                {sentToKitchen.map(kot => (
                  <div key={kot.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">Order #{kot.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(kot.status)}`}>
                        📝 {kot.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{formatTime(kot.timestamp)}</div>
                    <div className="space-y-1">
                      {kot.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          • {item.name} ×{item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview Bill Button */}
              <button
                onClick={handlePreviewBill}
                className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>👁️</span>
                <span>Preview Bill</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
