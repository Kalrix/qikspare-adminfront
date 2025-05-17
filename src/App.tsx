import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/dashboard/Dashboard";
import UsersPage from "./pages/users/UsersPage";
import UserDetailPage from "./pages/users/UserDetailPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import ViewInvoicePage from "./pages/invoices/ViewInvoicePage"; // 🆕
import EditInvoice from "./pages/invoices/EditInvoice";         // 🆕

import PrivateRoute from "./routes/PrivateRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <UserDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              <InvoicesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/invoices/create"
          element={
            <PrivateRoute>
              <CreateInvoice />
            </PrivateRoute>
          }
        />

        <Route
          path="/invoices/view/:id"
          element={
            <PrivateRoute>
              <ViewInvoicePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/invoices/edit/:id"
          element={
            <PrivateRoute>
              <EditInvoice />
            </PrivateRoute>
          }
        />

        {/* 🔁 Wildcard fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
