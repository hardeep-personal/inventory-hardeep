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

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/purchases" element={<PurchasePage />} />
          <Route path="/sales" element={<SalePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/vaccine" element={<Vaccine />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
