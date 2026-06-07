import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SellerCenter from "./pages/SellerCenter";
import SellerAddProduct from "./pages/SellerAddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import VendorHome from "./pages/VendorHome";
import BuyerHome from "./pages/BuyerHome";
import GoogleMapDebug from "./pages/GoogleMapDebug";
import WarehouseManagement from "./components/Seller/Warehouse/WarehouseManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Nhóm Route của Seller */}
        <Route path="/seller" element={<SellerCenter />} />
        <Route path="/seller/warehouse" element={<WarehouseManagement />} />

        <Route
          path="/buyer"
          element={<Navigate to="/buyer/tong-quan" replace />}
        />
        <Route path="/buyer/:section" element={<BuyerHome />} />

        {/* Nhóm Route của Vendor (Có thể gộp chung với Seller tùy logic của nhóm) */}
        <Route
          path="/vendor"
          element={<Navigate to="/vendor/trangchu" replace />}
        />
        <Route path="/vendor/products/add" element={<SellerAddProduct />} />
        <Route path="/vendor/:section/:action" element={<VendorHome />} />
        <Route path="/vendor/:section" element={<VendorHome />} />

        <Route path="/quantri" element={<AdminDashboard />} />
        <Route path="/debug/google-map" element={<GoogleMapDebug />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
