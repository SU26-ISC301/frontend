import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SellerCenter from "./pages/SellerCenter";
import SellerAddProduct from "./pages/SellerAddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import VendorHome from "./pages/VendorHome";
import BuyerHome from "./pages/BuyerHome";
import WarehouseManagement from "./components/Seller/Warehouse/WarehouseManagement";
import VendorSubscriptionCheckout from "./pages/VendorSubscriptionCheckout";
import { ThemeToggle } from "./components/ThemeToggle";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import ShopDetail from "./pages/ShopDetail";
import { MessageLauncher } from "./components/Messaging/MessageLauncher";
import { AiChatboxLauncher } from "./components/AiChatbox/AiChatbox";

function BuyerChannelShortcuts() {
  const { pathname } = useLocation();
  const hiddenPrefixes = ["/vendor", "/seller", "/admin", "/quantri", "/buyer"];
  const shouldHide = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (shouldHide) return null;

  return (
    <>
      <AiChatboxLauncher mode="buyer" />
      <MessageLauncher mode="buyer" />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/shop/:id" element={<ShopDetail />} />

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
        <Route path="/vendor/products/edit/:sku" element={<SellerAddProduct isEdit={true} />} />
        <Route path="/vendor/subscription/checkout" element={<VendorSubscriptionCheckout />} />
        <Route path="/vendor/:section/:action" element={<VendorHome />} />
        <Route path="/vendor/:section" element={<VendorHome />} />

        <Route
          path="/quantri"
          element={<Navigate to="/admin/tong-quan" replace />}
        />
        <Route
          path="/admin"
          element={<Navigate to="/admin/tong-quan" replace />}
        />
        <Route path="/admin/:section" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BuyerChannelShortcuts />
      <ThemeToggle />
    </BrowserRouter>
  );
}

export default App;
