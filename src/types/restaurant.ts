// Restaurant-specific types

export interface Table {
  id: string;
  name: string;
  status: 'FREE' | 'OCCUPIED' | 'BILL_PENDING';
  restaurantId: string;
  currentOrderId?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  available: boolean;
  gstPercentage: number;
  restaurantId: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  tableName: string;
  items: OrderItem[];
  status: 'DRAFT' | 'KOT_SENT' | 'PREPARING' | 'READY' | 'SERVED' | 'BILL_PENDING' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  discountPercentage: number;
  cgst: number;
  sgst: number;
  cgstPercentage: number;
  sgstPercentage: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  kotPrinted: boolean;
  billPrinted: boolean;
}

export interface OrderItem {
  id?: string;
  menuItemId?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  discount?: number;
  discountPercentage?: number;
  gstPercentage?: number;
  cgst?: number;
  sgst?: number;
  itemTotal?: number;
  isQuickAdd?: boolean;
}

export interface Staff {
  id: string;
  username: string;
  mobile: string;
  firstName: string;
  lastName?: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF' | 'CASHIER';
  restaurantId: string;
  pin: string;
  active: boolean;
  createdAt: string;
}

export interface KitchenOrder {
  id: string;
  tableId: string;
  tableName: string;
  items: KitchenOrderItem[];
  status: 'PENDING' | 'PREPARING' | 'READY';
  createdAt: string;
  kotNumber: string;
}

export interface KitchenOrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface TableStatus {
  free: number;
  occupied: number;
  billPending: number;
  total: number;
}

export interface BillCalculation {
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  cgst: number;
  sgst: number;
  cgstPercentage: number;
  sgstPercentage: number;
  grandTotal: number;
}

// Additional types for KOT flow
export interface KOT {
  id: string | number;
  kotNumber: number;
  items: OrderItem[];
  timestamp: Date | string;
  tableId?: string;
  tableName?: string;
}

export interface CreateOrderRequest {
  tableId: string | number;
  items: {
    menuItemId: string | number;
    quantity: number;
  }[];
}

export interface CreateBillRequest {
  tableId: string | number;
  items: {
    menuItemId: string | number;
    quantity: number;
    price: number;
  }[];
  discount?: number;
  gstPercentage?: number;
}
