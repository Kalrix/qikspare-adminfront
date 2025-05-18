const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const API = {
  // 🔐 Auth (with repeated /api/auth/api/auth/)
  LOGIN_PIN: `${BASE_URL}/api/auth/api/auth/login-pin`,
  REQUEST_OTP: `${BASE_URL}/api/auth/api/auth/request-otp`,
  VERIFY_OTP: `${BASE_URL}/api/auth/api/auth/verify-otp`,
  REGISTER: `${BASE_URL}/api/auth/api/auth/register-user`,

  // 👤 Users
  USERS: `${BASE_URL}/api/admin/users`,
  USER_DETAIL: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,
  USER_UPDATE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,
  USER_DELETE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,

  // 👤 Profile
  PROFILE_ME: `${BASE_URL}/api/auth/api/auth/me`,
  PROFILE_UPDATE: `${BASE_URL}/api/auth/api/auth/update-profile`,

  // 🔧 Admin
  ADMIN_CREATE: `${BASE_URL}/api/admin/create-user`,

  // 🧾 Invoices (match double path)
  INVOICE_CREATE: `${BASE_URL}/api/invoices/api/invoices/create`,
  INVOICE_LIST: `${BASE_URL}/api/invoices/api/invoices/list`,
  INVOICE_DETAIL: (invoiceId: string) => `${BASE_URL}/api/invoices/api/invoices/${invoiceId}`,
  INVOICE_UPDATE: (invoiceId: string) => `${BASE_URL}/api/invoices/api/invoices/update/${invoiceId}`,
  INVOICE_DELETE: (invoiceId: string) => `${BASE_URL}/api/invoices/api/invoices/delete/${invoiceId}`,

  // 👥 Customers
  CUSTOMER_CREATE: `${BASE_URL}/api/customers/api/customers/create`,
  CUSTOMER_LIST: `${BASE_URL}/api/customers/api/customers/list`,
  CUSTOMER_UPDATE: (customerId: string) => `${BASE_URL}/api/customers/api/customers/update/${customerId}`,
  CUSTOMER_DELETE: (customerId: string) => `${BASE_URL}/api/customers/api/customers/delete/${customerId}`,
};
