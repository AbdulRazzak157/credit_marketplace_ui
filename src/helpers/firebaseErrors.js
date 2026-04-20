// Firebase Authentication Error Messages (extended with password-related cases)
const firebaseErrors = {
  // 🔐 Authentication
  "auth/invalid-credential": "Invalid credentials.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",

  // 📝 Signup / Registration
  "auth/email-already-in-use": "This email is already registered.",
  "auth/weak-password": "Password is too weak. Try a stronger one.",
  "auth/operation-not-allowed": "This sign-in method is not enabled.",

  // 🔄 Password-related operations
  "auth/requires-recent-login": "Please log in again before changing your password.",
  "auth/missing-password": "Password field cannot be empty.",
  "auth/invalid-password": "The provided password is invalid.",
  "auth/password-does-not-meet-requirements": "Password does not meet security requirements.",
  "auth/password-login-disabled": "Password sign-in is disabled for this account.",
  "auth/user-mismatch": "The provided credentials do not match the current user.",
  "auth/weak-password-update": "New password is too weak. Choose a stronger one.",
  "auth/recent-login-required": "Please reauthenticate to perform this sensitive action.",
  "auth/invalid-action-code": "The password reset link is invalid or expired.",
  "auth/expired-action-code": "The password reset link has expired. Please request a new one.",

  // 🚦 Too many requests / throttling
  "auth/too-many-requests": "Too many attempts. Please try again later.",

  // 🌐 Network / Internal issues
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/internal-error": "Something went wrong. Please try again.",

  // 🪟 Popup / redirect related
  "auth/popup-closed-by-user": "The popup was closed before completing sign in.",
  "auth/cancelled-popup-request": "Popup request was cancelled.",

  // 🔸 Multi-factor authentication
  "auth/multi-factor-auth-required": "Multi-factor authentication required.",

  // ⚙️ Default fallback
  default: "An unknown error occurred. Please try again."
};

/**
 * Get a user-friendly error message from Firebase error
 * @param {object|string} error Firebase error object or code
 * @returns {string} Human-friendly message
 */
export function getFirebaseErrorMessage(error) {
  const errorCode = typeof error === "string" ? error : error?.code;
  return firebaseErrors[errorCode] || firebaseErrors.default;
}
