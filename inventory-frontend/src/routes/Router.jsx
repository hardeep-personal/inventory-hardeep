import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProductPage from '../pages/ProductPage';
import PurchasePage from '../pages/PurchasePage';
import SalePage from '../pages/SalePage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import Vaccine from '../pages/Vaccine';
import Prescription from '../pages/Prescription';
import Reception from '../pages/Reception';
import ProtectedRoute from './ProtectedRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'reception', 'doctor']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductPage />
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PurchasePage />
            </ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SalePage />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/vaccine" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Vaccine />
            </ProtectedRoute>
          } />
          <Route path="/prescription" element={
            <ProtectedRoute allowedRoles={['admin', 'doctor']}>
              <Prescription />
            </ProtectedRoute>
          } />
          <Route path="/receipt" element={
            <ProtectedRoute allowedRoles={['admin', 'reception']}>
              <Reception />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
