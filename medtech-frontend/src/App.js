import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/patient/Dashboard';
import SearchMap from './pages/patient/SearchMap';
import MyBookings from './pages/patient/MyBookings';
import SupplierDashboard from './pages/hospital/SupplierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

function ProtectedLayout({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" />;
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={
              <ProtectedLayout allowedRoles={['PATIENT']}>
                <Dashboard />
              </ProtectedLayout>
            }/>
            <Route path="/map" element={
              <ProtectedLayout allowedRoles={['PATIENT']}>
                <SearchMap />
              </ProtectedLayout>
            }/>
            <Route path="/bookings" element={
              <ProtectedLayout allowedRoles={['PATIENT']}>
                <MyBookings />
              </ProtectedLayout>
            }/>
            <Route path="/supplier" element={
              <ProtectedLayout allowedRoles={['HOSPITAL']}>
                <SupplierDashboard />
              </ProtectedLayout>
            }/>
            <Route path="/admin" element={
              <ProtectedLayout allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedLayout>
            }/>
          </Routes>
          <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
