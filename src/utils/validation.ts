// Input validations

export const validation = {
  // Mobile number validation - exactly 10 digits
  validateMobile(mobile: string): boolean {
    return /^\d{10}$/.test(mobile);
  },

  // Email validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Required field validation
  isRequired(value: string | number | null | undefined): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },

  // Number validation
  isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // Positive number validation
  isPositiveNumber(value: any): boolean {
    return this.isNumber(value) && parseFloat(value) > 0;
  },

  // GST number validation (basic)
  validateGST(gst: string): boolean {
    // Basic GST format: 15 characters
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
  },

  // Price validation
  validatePrice(price: any): boolean {
    return this.isPositiveNumber(price);
  },

  // Quantity validation
  validateQuantity(quantity: any): boolean {
    return this.isPositiveNumber(quantity) && Number.isInteger(Number(quantity));
  },

  // Percentage validation (0-100)
  validatePercentage(percentage: any): boolean {
    const num = parseFloat(percentage);
    return this.isNumber(percentage) && num >= 0 && num <= 100;
  },

  // Username validation
  validateUsername(username: string): boolean {
    // At least 3 characters, alphanumeric and underscore
    return /^[a-zA-Z0-9_]{3,}$/.test(username);
  },

  // PIN validation (4-6 digits)
  validatePIN(pin: string): boolean {
    return /^\d{4,6}$/.test(pin);
  },

  // Table name validation
  validateTableName(name: string): boolean {
    return this.isRequired(name) && name.trim().length >= 1;
  },

  // Order rolls minimum quantity
  validateOrderRollsQuantity(quantity: any): boolean {
    const num = parseInt(quantity, 10);
    return this.isNumber(quantity) && num >= 20;
  },
};

export default validation;
