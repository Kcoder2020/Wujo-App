/**
 * Validate phone number in E.164 format
 * E.164 format: +[country code][number] (e.g., +251911110000)
 * @param phone - Phone number string
 * @returns True if valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  // E.164 format: starts with +, followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

/**
 * Validate email address format
 * @param email - Email address string
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate that a number is positive
 * @param value - Number or string to validate
 * @returns True if positive number, false otherwise
 */
export const isPositiveNumber = (value: number | string): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Validate that a value is a positive integer
 * @param value - Number or string to validate
 * @returns True if positive integer, false otherwise
 */
export const isPositiveInteger = (value: number | string): boolean => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num) && num > 0;
};

/**
 * Validate password strength
 * Minimum 8 characters
 * @param password - Password string
 * @returns True if valid, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validate that a date is in the future
 * @param date - Date string or Date object
 * @returns True if date is in the future, false otherwise
 */
export const isFutureDate = (date: string | Date): boolean => {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return inputDate > now;
};

/**
 * Validate ISO 8601 date format
 * @param dateString - Date string
 * @returns True if valid ISO 8601 format, false otherwise
 */
export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString.substring(0, 10));
};

/**
 * Sanitize string input (remove leading/trailing whitespace)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  return input.trim();
};
