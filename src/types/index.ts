// Core types for the application

export interface User {
  id: string;
  username: string;
  mobile: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF' | 'CASHIER';
  restaurantId: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  available: boolean;
  gstPercentage?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  restaurantId: string;
  tableId?: string;
  tableName?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountPercentage?: number;
  cgst: number;
  sgst: number;
  cgstPercentage: number;
  sgstPercentage: number;
  grandTotal: number;
  paymentMode?: string;
  customerName?: string;
  customerMobile?: string;
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'FINALIZED' | 'CANCELLED';
  createdBy: string;
}

export interface InvoiceItem {
  id?: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  discount?: number;
  discountPercentage?: number;
  gstPercentage: number;
  cgst: number;
  sgst: number;
  itemTotal: number;
}

export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  address?: string;
  mobile?: string;
  email?: string;
  gstNumber?: string;
  cgstPercentage: number;
  sgstPercentage: number;
  currency: string;
  printerConfig?: PrinterConfig;
}

export interface PrinterConfig {
  kotPrinter?: string;
  billPrinter?: string;
  printerType: '58mm' | '80mm';
}

export interface Expense {
  id: string;
  restaurantId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string;
}

export interface Report {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalExpenses?: number;
}

export interface Subscription {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  features: string[];
}
