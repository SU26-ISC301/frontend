import { AdminLayout } from '../components/Admin/AdminLayout';
import { VendorApprovalTable } from '../components/Admin/VendorApprovalTable';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Duyệt gian hàng</h1>
        <p className="mt-1 text-sm text-gray-600">
          Module 1 — Admin phê duyệt hoặc từ chối Seller đăng ký mới
        </p>
      </div>

      <VendorApprovalTable />
    </AdminLayout>
  );
}
