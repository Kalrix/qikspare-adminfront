const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const API = {
  // 🔐 Auth
  LOGIN_PIN: `${BASE_URL}/api/auth/login-pin`,
  REQUEST_OTP: `${BASE_URL}/api/auth/request-otp`,
  VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
  REGISTER: `${BASE_URL}/api/auth/register-user`,

  // 👤 Users
  USERS: `${BASE_URL}/api/admin/users`, // GET all users, POST new user
  USER_DETAIL: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,
  USER_UPDATE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,

  // 👤 Profile
  PROFILE_ME: `${BASE_URL}/api/profile/me`,
  PROFILE_UPDATE: `${BASE_URL}/api/profile/update`,

  // 🔧 Admin
  ADMIN_CREATE: `${BASE_URL}/api/admin/create-user`,

  // 🧾 Invoices
  INVOICE_CREATE: `${BASE_URL}/api/invoices/api/invoices/create`, // ✅ Corrected
  INVOICE_LIST: `${BASE_URL}/api/invoices/api/invoices/list`,
  INVOICE_DETAIL: (invoiceId: string) => `${BASE_URL}/api/invoices/api/invoices/${invoiceId}`,
  INVOICE_UPDATE: (invoiceId: string) => `${BASE_URL}/api/invoices/api/invoices/update/${invoiceId}`,
  INVOICE_DELETE: (invoiceId: string) => `${BASE_URL}/api/invoices/api/invoices/delete/${invoiceId}`,

};
