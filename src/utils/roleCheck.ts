// Role-based access control

import type { User } from '../types';
import authService from './authService';

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'CASHIER';

export const roleCheck = {
  getCurrentUser(): User | null {
    return authService.getUser();
  },

  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  },

  isOwner(): boolean {
    return this.hasRole('OWNER');
  },

  isManager(): boolean {
    return this.hasRole('MANAGER');
  },

  isStaff(): boolean {
    return this.hasRole('STAFF');
  },

  isCashier(): boolean {
    return this.hasRole('CASHIER');
  },

  // Combined role checks
  isOwnerOrManager(): boolean {
    return this.hasRole(['OWNER', 'MANAGER']);
  },

  canManageBilling(): boolean {
    // OWNER, MANAGER, and CASHIER can manage billing
    return this.hasRole(['OWNER', 'MANAGER', 'CASHIER']);
  },

  canSeePrices(): boolean {
    // Everyone except STAFF can see prices
    return !this.isStaff();
  },

  canApplyDiscount(): boolean {
    // Only OWNER, MANAGER, and CASHIER can apply discounts
    return this.hasRole(['OWNER', 'MANAGER', 'CASHIER']);
  },

  canPrintBill(): boolean {
    // Only OWNER, MANAGER, and CASHIER can print bills
    return this.hasRole(['OWNER', 'MANAGER', 'CASHIER']);
  },

  canCloseTable(): boolean {
    // Only OWNER, MANAGER, and CASHIER can close tables
    return this.hasRole(['OWNER', 'MANAGER', 'CASHIER']);
  },

  canAccessReports(): boolean {
    // Only OWNER and MANAGER can access reports
    return this.hasRole(['OWNER', 'MANAGER']);
  },

  canManageStaff(): boolean {
    // Only OWNER can manage staff
    return this.isOwner();
  },

  canManageMenu(): boolean {
    // OWNER and MANAGER can manage menu
    return this.hasRole(['OWNER', 'MANAGER']);
  },

  canSendKOT(): boolean {
    // Everyone can send KOT
    return true;
  },
};

export default roleCheck;
