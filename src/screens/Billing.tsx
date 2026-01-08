import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ItemCard from '../components/ItemCard';
import BillSummary from '../components/BillSummary';
import { restaurantApi } from '../api/restaurantApi';
import type { MenuItem, OrderItem, Table } from '../types/restaurant';
import type { RestaurantSettings } from '../types';
import { roleCheck } from '../utils/roleCheck';
import { validation } from '../utils/validation';

const Billing: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const table = location.state?.table as Table | undefined;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [billItems, setBillItems] = useState<OrderItem[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [quickAddItem, setQuickAddItem] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const canSeePrices = roleCheck.canSeePrices();
  const canApplyDiscount = roleCheck.canApplyDiscount();
  const canPrintBill = roleCheck.canPrintBill();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      const [menuData, settingsData] = await Promise.all([
        restaurantApi.getMenu(),
        restaurantApi.getSettings(),
      ]);

      setMenuItems(menuData);
      setSettings(settingsData);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(menuData.map(item => item.category)));
      setCategories(['All', ...uniqueCategories]);

    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      alert('Failed to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const calculateBill = () => {
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const taxableAmount = subtotal - discountAmount;
    
    const cgstPercentage = settings?.cgstPercentage || 2.5;
    const sgstPercentage = settings?.sgstPercentage || 2.5;
    
    const cgst = (taxableAmount * cgstPercentage) / 100;
    const sgst = (taxableAmount * sgstPercentage) / 100;
    const grandTotal = taxableAmount + cgst + sgst;

    return {
      subtotal,
      discountAmount,
      discountPercentage,
      cgst,
      sgst,
      cgstPercentage,
      sgstPercentage,
      grandTotal,
    };
  };

  const handleAddItem = (menuItem: MenuItem) => {
    const existingItemIndex = billItems.findIndex(
      item => item.menuItemId === menuItem.id && !item.isQuickAdd
    );

    if (existingItemIndex >= 0) {
      // Increment quantity
      const updatedItems = [...billItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      
      // Recalculate GST
      const itemTotal = updatedItems[existingItemIndex].total;
      const gstAmount = (itemTotal * updatedItems[existingItemIndex].gstPercentage) / 100;
      updatedItems[existingItemIndex].cgst = gstAmount / 2;
      updatedItems[existingItemIndex].sgst = gstAmount / 2;
      updatedItems[existingItemIndex].itemTotal = itemTotal + gstAmount;
      
      setBillItems(updatedItems);
    } else {
      // Add new item
      const gstAmount = (menuItem.price * menuItem.gstPercentage) / 100;
      const newItem: OrderItem = {
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price,
        total: menuItem.price,
        gstPercentage: menuItem.gstPercentage,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        itemTotal: menuItem.price + gstAmount,
        isQuickAdd: false,
      };

      setBillItems([...billItems, newItem]);
    }
  };

  const handleQuickAddItem = () => {
    if (!validation.isRequired(quickAddItem)) {
      return;
    }

    const gstPercentage = settings?.cgstPercentage || 2.5;
    const newItem: OrderItem = {
      name: quickAddItem,
      quantity: 1,
      price: 0,
      total: 0,
      gstPercentage: gstPercentage * 2,
      cgst: 0,
      sgst: 0,
      itemTotal: 0,
      isQuickAdd: true,
    };

    setBillItems([...billItems, newItem]);
    setQuickAddItem('');
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updatedItems = [...billItems];
    const newQuantity = updatedItems[index].quantity + delta;

    if (newQuantity <= 0) {
      // Remove item
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index].quantity = newQuantity;
      updatedItems[index].total = newQuantity * updatedItems[index].price;
      
      // Recalculate GST
      const itemTotal = updatedItems[index].total;
      const gstAmount = (itemTotal * updatedItems[index].gstPercentage) / 100;
      updatedItems[index].cgst = gstAmount / 2;
      updatedItems[index].sgst = gstAmount / 2;
      updatedItems[index].itemTotal = itemTotal + gstAmount;
    }

    setBillItems(updatedItems);
  };

  const handleEditItem = (item: OrderItem, index: number) => {
    setEditingItem({ ...item, id: index.toString() });
    setShowEditModal(true);
  };

  const handleSaveEditedItem = () => {
    if (!editingItem) return;

    const index = parseInt(editingItem.id || '0');
    const updatedItems = [...billItems];
    
    // Update the item
    updatedItems[index] = {
      ...editingItem,
      total: editingItem.quantity * editingItem.price,
    };

    // Recalculate with discount if any
    const itemTotal = updatedItems[index].total;
    const discountAmount = editingItem.discountPercentage
      ? (itemTotal * editingItem.discountPercentage) / 100
      : 0;
    const taxableAmount = itemTotal - discountAmount;
    
    const gstAmount = (taxableAmount * updatedItems[index].gstPercentage) / 100;
    updatedItems[index].cgst = gstAmount / 2;
    updatedItems[index].sgst = gstAmount / 2;
    updatedItems[index].itemTotal = taxableAmount + gstAmount;
    updatedItems[index].discount = discountAmount;

    setBillItems(updatedItems);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleSendKOT = async () => {
    if (billItems.length === 0) {
      alert('Please add items to the bill');
      return;
    }

    try {
      const orderData = {
        tableId,
        tableName: table?.name || `Table ${tableId}`,
        items: billItems,
        status: 'KOT_SENT' as const,
        ...calculateBill(),
      };

      await restaurantApi.createOrder(orderData);
      alert('KOT sent successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to send KOT');
    }
  };

  const handlePrintBill = () => {
    alert('Print bill functionality - would connect to printer');
  };

  const handleShareWhatsApp = () => {
    alert('Share via WhatsApp functionality');
  };

  const handleSaveBill = async () => {
    if (billItems.length === 0) {
      alert('Please add items to the bill');
      return;
    }

    try {
      const billData = {
        tableId,
        tableName: table?.name || `Table ${tableId}`,
        items: billItems,
        ...calculateBill(),
        status: 'FINALIZED' as const,
      };

      await restaurantApi.createBill(billData);
      alert('Bill saved successfully!');
      navigate('/tables');
    } catch (err: any) {
      alert(err.message || 'Failed to save bill');
    }
  };

  const billCalc = calculateBill();

  if (loading) {
    return (
      <Layout title={`Billing - ${table?.name || 'Table'}`}>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Billing - ${table?.name || 'Table'}`}>
      <div className="flex gap-4 h-full">
        {/* LEFT PANEL - Categories & Menu Items */}
        <div className="w-[30%] flex flex-col space-y-4">
          {/* Categories */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} onAdd={handleAddItem} />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Bill Items */}
        <div className="w-[40%] flex flex-col space-y-4">
          <div className="card flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Items Added to Bill</h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {billItems.length === 0 && (
                <p className="text-gray-400 text-center py-8">No items added yet</p>
              )}

              {billItems.map((item, index) => (
                <div key={index} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.isQuickAdd && (
                        <span className="text-xs text-orange-600">Quick Add Item</span>
                      )}
                    </div>
                    {canSeePrices && (
                      <span className="font-bold text-primary">
                        ₹{item.itemTotal.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(index, -1)}
                        className="w-7 h-7 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(index, 1)}
                        className="w-7 h-7 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        +
                      </button>
                    </div>

                    {canSeePrices && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {item.quantity} × ₹{item.price}
                        </span>
                        <button
                          onClick={() => handleEditItem(item, index)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Item */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Add Item
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={quickAddItem}
                  onChange={(e) => setQuickAddItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickAddItem()}
                  className="input-field"
                  placeholder="Item name"
                />
                <button onClick={handleQuickAddItem} className="btn-primary">
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Quick add items apply to this bill only (not stock)
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Bill Summary & Actions */}
        <div className="w-[30%] flex flex-col space-y-4">
          {/* Discount Input */}
          {canApplyDiscount && canSeePrices && (
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Discount (%)
              </label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                className="input-field"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          )}

          {/* Bill Summary */}
          <BillSummary {...billCalc} />

          {/* Actions */}
          <div className="card space-y-3">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="w-full btn-primary"
            >
              Preview Bill
            </button>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="input-field"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 1 })}
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Discount (%)
                </label>
                <input
                  type="number"
                  value={editingItem.discountPercentage || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, discountPercentage: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>GST:</span>
                    <span>{editingItem.gstPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST:</span>
                    <span>{editingItem.gstPercentage / 2}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST:</span>
                    <span>{editingItem.gstPercentage / 2}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveEditedItem} className="flex-1 btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Bill Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Bill Preview</h3>
            
            {/* Bill Summary */}
            <div className="space-y-4 mb-6">
              <div className="border-b pb-4">
                <p className="text-gray-600">Table: <span className="font-semibold">{table?.name}</span></p>
              </div>

              {canSeePrices && (
                <>
                  <div className="space-y-2">
                    {billItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.itemTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{billCalc.subtotal.toFixed(2)}</span>
                    </div>
                    {billCalc.discountPercentage > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Discount ({billCalc.discountPercentage}%)</span>
                        <span>- ₹{billCalc.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>CGST ({billCalc.cgstPercentage}%)</span>
                      <span>₹{billCalc.cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SGST ({billCalc.sgstPercentage}%)</span>
                      <span>₹{billCalc.sgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Grand Total</span>
                      <span className="text-primary">₹{billCalc.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button onClick={handleSendKOT} className="w-full btn-primary">
                Send KOT
              </button>
              
              {canPrintBill && (
                <>
                  <button onClick={handlePrintBill} className="w-full btn-primary">
                    Print Bill
                  </button>
                  <button onClick={handleShareWhatsApp} className="w-full btn-secondary">
                    Share via WhatsApp
                  </button>
                  <button onClick={handleSaveBill} className="w-full btn-primary">
                    Save Bill
                  </button>
                </>
              )}

              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Billing;
