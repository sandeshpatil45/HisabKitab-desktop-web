import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import type { MenuItem, OrderItem, KOT, Table } from '../types/restaurant';

export default function MenuOrderScreen() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const table = location.state?.table as Table | undefined;
  const tableId = id || '';

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentSelection, setCurrentSelection] = useState<OrderItem[]>([]);
  const [sentKOTs, setSentKOTs] = useState<KOT[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingKOT, setSendingKOT] = useState(false);

  const role = localStorage.getItem('role') || '';
  const isStaff = role === 'STAFF';

  useEffect(() => {
    fetchMenuData();
    fetchExistingOrders();
  }, [tableId]);

  const fetchMenuData = async () => {
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

  const fetchExistingOrders = async () => {
    try {
      const response = await restaurantApi.getTableOrders(tableId);
      const orders = (response as any)?.data || response;
      const ordersArray = Array.isArray(orders) ? orders : [];
      
      // Convert orders to KOT format
      const kots: KOT[] = ordersArray.map((order: any, index: number) => ({
        id: order.id,
        kotNumber: index + 1,
        items: order.items,
        timestamp: order.createdAt,
        tableId: order.tableId,
        tableName: order.tableName,
      }));
      
      setSentKOTs(kots);
    } catch (err: any) {
      console.error('Failed to fetch existing orders:', err);
      // Don't alert - table might not have orders yet
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addItem = (menuItem: MenuItem) => {
    const existing = currentSelection.find(i => i.menuItemId === menuItem.id);
    if (existing) {
      setCurrentSelection(
        currentSelection.map(i =>
          i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i
        )
      );
    } else {
      setCurrentSelection([
        ...currentSelection,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          total: menuItem.price,
        },
      ]);
    }
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCurrentSelection(
      currentSelection
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
    setCurrentSelection(currentSelection.filter(item => item.menuItemId !== menuItemId));
  };

  const clearAll = () => {
    if (currentSelection.length > 0) {
      if (confirm('Clear all items from current selection?')) {
        setCurrentSelection([]);
      }
    }
  };

  const handleSendKOT = async () => {
    if (currentSelection.length === 0) {
      alert('Please add items before sending KOT');
      return;
    }

    if (!confirm('Send KOT to kitchen?')) {
      return;
    }

    setSendingKOT(true);

    try {
      // Send ONLY current selection (NOT previously sent items)
      const response = await restaurantApi.createOrder({
        tableId: tableId,
        items: currentSelection.map(item => ({
          menuItemId: item.menuItemId!,
          quantity: item.quantity,
        })),
      });

      // Add to sent KOTs list
      const newKOT: KOT = {
        id: response.id || response.data?.id || Date.now().toString(),
        items: [...currentSelection],
        timestamp: new Date().toISOString(),
        kotNumber: sentKOTs.length + 1,
        tableId: tableId,
        tableName: table?.name || `Table ${tableId}`,
      };

      setSentKOTs([...sentKOTs, newKOT]);

      // Clear current selection for next KOT
      setCurrentSelection([]);

      alert('KOT sent successfully! Table remains open for more orders.');
    } catch (error: any) {
      alert('Failed to send KOT: ' + error.message);
    } finally {
      setSendingKOT(false);
    }
  };

  const calculateSubtotal = () => {
    return currentSelection.reduce((sum, item) => sum + item.total, 0);
  };

  const getTotalItemsInKOTs = () => {
    return sentKOTs.reduce((sum, kot) => sum + kot.items.reduce((s, item) => s + item.quantity, 0), 0);
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {table?.name || `Table ${tableId}`} - Menu & Order
          </h1>
          <p className="text-sm text-gray-600">
            {table?.capacity} Seats • {table?.status || 'Status Unknown'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/tables')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleSendKOT}
            disabled={sendingKOT || currentSelection.length === 0}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingKOT ? 'Sending...' : 'Send KOT'}
          </button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* LEFT PANEL - Menu */}
        <div className="col-span-5 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-green-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Menu</h2>
          </div>

          {/* Categories */}
          <div className="px-4 py-3 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-2">
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
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {!isStaff && <p className="text-green-600 font-bold mt-1">₹{item.price}</p>}
                      {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      className="ml-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-center text-gray-500 py-8">No items in this category</p>
              )}
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Current Selection */}
        <div className="col-span-4 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Items to Send</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {currentSelection.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No items added yet</p>
            ) : (
              <div className="space-y-3">
                {currentSelection.map(item => (
                  <div key={item.menuItemId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 flex-1">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.menuItemId!)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
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
                      {!isStaff && <span className="font-bold text-green-600">₹{item.total.toFixed(2)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtotal and Actions */}
          <div className="border-t border-gray-200 p-4">
            {!isStaff && (
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="text-xl font-bold text-gray-800">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
            )}
            <button
              onClick={clearAll}
              disabled={currentSelection.length === 0}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Sent KOTs */}
        <div className="col-span-3 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-purple-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Previously Sent</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {sentKOTs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No KOTs sent yet</p>
            ) : (
              <div className="space-y-4">
                {sentKOTs.map(kot => (
                  <div key={kot.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800">KOT #{kot.kotNumber}</h3>
                      <span className="text-xs text-gray-500">{formatTime(kot.timestamp)}</span>
                    </div>
                    <div className="space-y-1">
                      {kot.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          • {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sentKOTs.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total Items Sent:</span> {getTotalItemsInKOTs()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
