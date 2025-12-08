/**
 * Demo Account Utility
 * 
 * Centralized utility for checking if an account is a demo/protected account.
 * Demo accounts are protected from edit/delete operations.
 * 
 * @param {string} email - User email to check
 * @returns {boolean} - True if account is a demo account
 */

// Demo account emails that should be protected
const DEMO_ACCOUNT_EMAILS = [
  "test@example.com",
  "admin@example.com",
];

/**
 * Check if an email belongs to a demo account
 * @param {string} email - User email to check
 * @returns {boolean} - True if email is a demo account
 */
export function isDemoAccount(email) {
  if (!email) return false;
  return DEMO_ACCOUNT_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Get list of demo account emails
 * @returns {string[]} - Array of demo account emails
 */
export function getDemoAccountEmails() {
  return [...DEMO_ACCOUNT_EMAILS];
}

