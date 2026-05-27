import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SellerCenter from './pages/SellerCenter';
import AdminDashboard from './pages/AdminDashboard';
import VendorHome from './pages/VendorHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller" element={<SellerCenter />} />
        <Route path="/vendor" element={<Navigate to="/vendor/trangchu" replace />} />
        <Route path="/vendor/:section" element={<VendorHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
