import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public Pages
import { Home } from '../pages/public/Home';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { ForgotPassword } from '../pages/public/ForgotPassword';
import { ResetPassword } from '../pages/public/ResetPassword';
import { VerifyEmail } from '../pages/public/VerifyEmail';

// Landlord Pages
import { Dashboard } from '../pages/landlord/Dashboard';
import { Properties } from '../pages/landlord/Properties';
import { Units } from '../pages/landlord/Units';
import { Tenants } from '../pages/landlord/Tenants';
import { Leases } from '../pages/landlord/Leases';
import { Payments } from '../pages/landlord/Payments';
import { Maintenance } from '../pages/landlord/Maintenance';
import { Documents } from '../pages/landlord/Documents';
import { Reports } from '../pages/landlord/Reports';
import { Settings } from '../pages/landlord/Settings';

// Tenant Pages
import { TenantDashboard } from '../pages/tenant/TenantDashboard';
import { MyLease } from '../pages/tenant/MyLease';
import { MyPayments } from '../pages/tenant/MyPayments';
import { MyMaintenance } from '../pages/tenant/MyMaintenance';
import { MyDocuments } from '../pages/tenant/MyDocuments';
import { Profile } from '../pages/tenant/Profile';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home */}
      <Route path="/" element={<Home />} />

      {/* Auth Pages wrapped in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<Navigate to="/dashboard" replace />} />
        <Route path="/verify-email/:token" element={<Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Landlord Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['LANDLORD', 'SUPER_ADMIN']} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/units" element={<Units />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/leases" element={<Leases />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Tenant Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['TENANT']} />}>
        <Route element={<MainLayout />}>
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/tenant/my-lease" element={<MyLease />} />
          <Route path="/tenant/my-payments" element={<MyPayments />} />
          <Route path="/tenant/my-maintenance" element={<MyMaintenance />} />
          <Route path="/tenant/my-documents" element={<MyDocuments />} />
          <Route path="/tenant/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
