/**
 * Ethiopian Phone Validation Utilities
 * Handles phone number formatting and validation for Ethiopian numbers
 */

/**
 * Formats a phone number to E.164 format (+251XXXXXXXXX)
 * Handles multiple input formats:
 * - 0911110000
 * - 911110000
 * - +251911110000
 *
 * @param phone - The phone number to format
 * @returns The phone number in E.164 format
 */
export const formatPhoneToE164 = (phone: string): string => {
  // Remove all non-numeric characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // If it starts with +251, it's already in E.164 format
  if (cleaned.startsWith("+251")) {
    return cleaned;
  }

  // If it starts with 251, add the +
  if (cleaned.startsWith("251")) {
    return "+" + cleaned;
  }

  // If it starts with 0, remove it and add +251
  if (cleaned.startsWith("0")) {
    return "+251" + cleaned.substring(1);
  }

  // Otherwise, assume it's a local number without country code
  return "+251" + cleaned;
};

/**
 * Validates if a phone number is in valid Ethiopian format
 * Valid Ethiopian mobile numbers start with 9 or 7 after the country code
 * and have 9 digits total
 *
 * @param phone - The phone number to validate
 * @returns true if the phone number is valid, false otherwise
 */
export const validatePhoneFormat = (phone: string): boolean => {
  // First convert to E.164 format
  const e164Phone = formatPhoneToE164(phone);

  // Ethiopian phone regex: +251 followed by 9 or 7, then 8 more digits
  const ethiopianPhoneRegex = /^\+251[97]\d{8}$/;

  return ethiopianPhoneRegex.test(e164Phone);
};

/**
 * Formats a phone number for display
 * Converts E.164 format to a more readable format
 *
 * @param phone - The phone number in E.164 format
 * @returns Formatted phone number for display
 */
export const formatPhoneForDisplay = (phone: string): string => {
  if (!phone) return "";

  const e164Phone = formatPhoneToE164(phone);

  // Format as +251 9XX XXX XXX
  if (e164Phone.length === 13) {
    return `${e164Phone.substring(0, 4)} ${e164Phone.substring(
      4,
      7
    )} ${e164Phone.substring(7, 10)} ${e164Phone.substring(10)}`;
  }

  return e164Phone;
};
