// Restaurant API endpoints

import apiService from './apiService';
import type {
  Table,
  MenuItem,
  Order,
  Staff,
  KitchenOrder,
  MenuCategory,
} from '../types/restaurant';
import type { RestaurantSettings, Invoice, Expense, Report } from '../types';

class RestaurantApi {
  // Settings
  async getSettings(): Promise<RestaurantSettings> {
    return apiService.get<RestaurantSettings>('/api/restaurant/settings');
  }

  async updateSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    return apiService.post<RestaurantSettings>('/api/restaurant/settings', settings);
  }

  // Tables
  async getTables(): Promise<Table[] | any> {
    const response = await apiService.get('/api/restaurant/tables');
    
    // Handle ApiResponse wrapper
    const tablesData = (response as any)?.data || response;
    
    return Array.isArray(tablesData) ? tablesData : response;
  }

  async createTable(tableData: Partial<Table> | any): Promise<Table> {
    return apiService.post<Table>('/api/restaurant/tables', tableData);
  }

  async updateTable(id: string, tableData: Partial<Table>): Promise<Table> {
    return apiService.put<Table>(`/api/restaurant/tables/${id}`, tableData);
  }

  async deleteTable(id: string): Promise<void> {
    return apiService.delete<void>(`/api/restaurant/tables/${id}`);
  }

  async getTableOrders(tableId: string): Promise<Order[] | any> {
    const response = await apiService.get(`/api/restaurant/tables/${tableId}/orders`);
    
    // Handle ApiResponse wrapper
    const ordersData = (response as any)?.data || response;
    
    return Array.isArray(ordersData) ? ordersData : response;
  }

  // Menu
  async getMenu(): Promise<MenuItem[]> {
    const response = await apiService.get('/api/restaurant/menu');
    
    // Handle ApiResponse wrapper
    const menuData = (response as any)?.data || response;
    
    return Array.isArray(menuData) ? menuData : [];
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return apiService.get<MenuCategory[]>('/api/restaurant/menu/categories');
  }

  async bulkAddMenu(items: Partial<MenuItem>[]): Promise<MenuItem[]> {
    return apiService.post<MenuItem[]>('/api/restaurant/menu/bulk', { items });
  }

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    return apiService.post<MenuItem>('/api/restaurant/menu', item);
  }

  async updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
    return apiService.put<MenuItem>(`/api/restaurant/menu/${id}`, item);
  }

  async deleteMenuItem(id: string): Promise<void> {
    return apiService.delete<void>(`/api/restaurant/menu/${id}`);
  }

  // Orders - Updated for KOT flow
  async createOrder(data: { tableId: string | number; items: { menuItemId: string | number; quantity: number }[] }): Promise<{ id?: string | number; data?: { id: string | number }; [key: string]: any }> {
    return apiService.post('/api/restaurant/orders', data);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return apiService.put<Order>(`/api/restaurant/orders/${orderId}/status`, { status });
  }

  async finalizeOrder(orderId: string, finalData?: any): Promise<Invoice> {
    return apiService.post<Invoice>(`/api/restaurant/orders/${orderId}/finalize`, finalData);
  }

  async getKitchenOrders(): Promise<KitchenOrder[]> {
    return apiService.get<KitchenOrder[]>('/api/restaurant/kitchen/orders');
  }

  // Staff
  async getStaff(): Promise<Staff[]> {
    return apiService.get<Staff[]>('/api/restaurant/staff');
  }

  async createStaff(staffData: Partial<Staff>): Promise<Staff> {
    return apiService.post<Staff>('/api/restaurant/staff', staffData);
  }

  async updateStaff(id: string, staffData: Partial<Staff>): Promise<Staff> {
    return apiService.put<Staff>(`/api/restaurant/staff/${id}`, staffData);
  }

  async deleteStaff(id: string): Promise<void> {
    return apiService.delete<void>(`/api/restaurant/staff/${id}`);
  }

  // Bills/Invoices - Updated for final bill generation
  async createBill(data: { 
    tableId: string | number; 
    tableName?: string;
    items: { menuItemId?: string; name: string; quantity: number; price: number }[];
    discount?: number;
    gstPercentage?: number;
    [key: string]: any;
  }): Promise<{ id?: string | number; [key: string]: any }> {
    return apiService.post('/api/bills', data);
  }

  async getBills(filters?: any): Promise<Invoice[]> {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/api/bills?${queryParams}` : '/api/bills';
    return apiService.get<Invoice[]>(endpoint);
  }

  async getBillDetails(id: string): Promise<Invoice> {
    return apiService.get<Invoice>(`/api/bills/${id}`);
  }

  // Reports
  async getSalesReport(startDate: string, endDate: string): Promise<Report> {
    return apiService.get<Report>(`/api/reports/sales?startDate=${startDate}&endDate=${endDate}`);
  }

  async getOrdersReport(startDate: string, endDate: string): Promise<any> {
    return apiService.get<any>(`/api/reports/orders?startDate=${startDate}&endDate=${endDate}`);
  }

  async getItemsReport(startDate: string, endDate: string): Promise<any> {
    return apiService.get<any>(`/api/reports/items?startDate=${startDate}&endDate=${endDate}`);
  }

  async getExpensesReport(startDate: string, endDate: string): Promise<any> {
    return apiService.get<any>(`/api/reports/expenses?startDate=${startDate}&endDate=${endDate}`);
  }

  // Expenses
  async createExpense(expenseData: Partial<Expense>): Promise<Expense> {
    return apiService.post<Expense>('/api/restaurant/expenses', expenseData);
  }

  async getExpenses(filters?: any): Promise<Expense[]> {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/api/restaurant/expenses?${queryParams}` : '/api/restaurant/expenses';
    return apiService.get<Expense[]>(endpoint);
  }

  // New methods for POS flow
  
  // Update table status (e.g., FREE, OCCUPIED, BILL_PENDING)
  async updateTableStatus(tableId: string | number, status: string): Promise<any> {
    return apiService.patch(`/api/restaurant/tables/${tableId}/status`, { status });
  }
}

export const restaurantApi = new RestaurantApi();
export default restaurantApi;
