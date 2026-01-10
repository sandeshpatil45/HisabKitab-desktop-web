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
    return apiService.get<RestaurantSettings>('/restaurant/settings');
  }

  async updateSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    return apiService.post<RestaurantSettings>('/restaurant/settings', settings);
  }

  // Tables
  async getTables(): Promise<Table[] | any> {
    const response = await apiService.get('/restaurant/tables');
    
    // Handle ApiResponse wrapper
    const tablesData = (response as any)?.data || response;
    
    return Array.isArray(tablesData) ? tablesData : response;
  }

  async createTable(tableData: Partial<Table>): Promise<Table> {
    return apiService.post<Table>('/restaurant/tables', tableData);
  }

  async updateTable(id: string, tableData: Partial<Table>): Promise<Table> {
    return apiService.put<Table>(`/restaurant/tables/${id}`, tableData);
  }

  async deleteTable(id: string): Promise<void> {
    return apiService.delete<void>(`/restaurant/tables/${id}`);
  }

  async getTableOrders(tableId: string): Promise<Order[]> {
    return apiService.get<Order[]>(`/restaurant/tables/${tableId}/orders`);
  }

  // Menu
  async getMenu(): Promise<MenuItem[]> {
    const response = await apiService.get('/restaurant/menu');
    
    // Handle ApiResponse wrapper
    const menuData = (response as any)?.data || response;
    
    return Array.isArray(menuData) ? menuData : [];
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return apiService.get<MenuCategory[]>('/restaurant/menu/categories');
  }

  async bulkAddMenu(items: Partial<MenuItem>[]): Promise<MenuItem[]> {
    return apiService.post<MenuItem[]>('/restaurant/menu/bulk', { items });
  }

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    return apiService.post<MenuItem>('/restaurant/menu', item);
  }

  async updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
    return apiService.put<MenuItem>(`/restaurant/menu/${id}`, item);
  }

  async deleteMenuItem(id: string): Promise<void> {
    return apiService.delete<void>(`/restaurant/menu/${id}`);
  }

  // Orders - Updated for KOT flow
  async createOrder(data: { tableId: string | number; items: { menuItemId: string | number; quantity: number }[] }): Promise<{ id?: string | number; data?: { id: string | number }; [key: string]: any }> {
    return apiService.post('/restaurant/orders', data);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return apiService.put<Order>(`/restaurant/orders/${orderId}/status`, { status });
  }

  async finalizeOrder(orderId: string, finalData?: any): Promise<Invoice> {
    return apiService.post<Invoice>(`/restaurant/orders/${orderId}/finalize`, finalData);
  }

  async getKitchenOrders(): Promise<KitchenOrder[]> {
    return apiService.get<KitchenOrder[]>('/restaurant/kitchen/orders');
  }

  // Staff
  async getStaff(): Promise<Staff[]> {
    return apiService.get<Staff[]>('/restaurant/staff');
  }

  async createStaff(staffData: Partial<Staff>): Promise<Staff> {
    return apiService.post<Staff>('/restaurant/staff', staffData);
  }

  async updateStaff(id: string, staffData: Partial<Staff>): Promise<Staff> {
    return apiService.put<Staff>(`/restaurant/staff/${id}`, staffData);
  }

  async deleteStaff(id: string): Promise<void> {
    return apiService.delete<void>(`/restaurant/staff/${id}`);
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
    return apiService.post('/bills', data);
  }

  async getBills(filters?: any): Promise<Invoice[]> {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/bills?${queryParams}` : '/bills';
    return apiService.get<Invoice[]>(endpoint);
  }

  async getBillDetails(id: string): Promise<Invoice> {
    return apiService.get<Invoice>(`/bills/${id}`);
  }

  // Reports
  async getSalesReport(startDate: string, endDate: string): Promise<Report> {
    return apiService.get<Report>(`/reports/sales?startDate=${startDate}&endDate=${endDate}`);
  }

  async getOrdersReport(startDate: string, endDate: string): Promise<any> {
    return apiService.get<any>(`/reports/orders?startDate=${startDate}&endDate=${endDate}`);
  }

  async getItemsReport(startDate: string, endDate: string): Promise<any> {
    return apiService.get<any>(`/reports/items?startDate=${startDate}&endDate=${endDate}`);
  }

  async getExpensesReport(startDate: string, endDate: string): Promise<any> {
    return apiService.get<any>(`/reports/expenses?startDate=${startDate}&endDate=${endDate}`);
  }

  // Expenses
  async createExpense(expenseData: Partial<Expense>): Promise<Expense> {
    return apiService.post<Expense>('/restaurant/expenses', expenseData);
  }

  async getExpenses(filters?: any): Promise<Expense[]> {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/restaurant/expenses?${queryParams}` : '/restaurant/expenses';
    return apiService.get<Expense[]>(endpoint);
  }

  // New methods for POS flow
  
  // Update table status (e.g., FREE, OCCUPIED, BILL_PENDING)
  async updateTableStatus(tableId: string | number, status: string): Promise<any> {
    return apiService.patch(`/restaurant/tables/${tableId}/status`, { status });
  }
}

export const restaurantApi = new RestaurantApi();
export default restaurantApi;
