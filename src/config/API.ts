const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const API = {
  LOGIN_PIN: `${BASE_URL}/api/auth/login-pin`,
  REQUEST_OTP: `${BASE_URL}/api/auth/request-otp`,
  VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
  REGISTER: `${BASE_URL}/api/auth/register-user`,

  USERS: `${BASE_URL}/api/admin/users`, // GET all users, POST new user
  USER_DETAIL: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`, // GET one user
  USER_UPDATE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`, // PATCH user

  PROFILE_ME: `${BASE_URL}/api/profile/me`,
  PROFILE_UPDATE: `${BASE_URL}/api/profile/update`,

  ADMIN_CREATE: `${BASE_URL}/api/admin/create-user`,
};
