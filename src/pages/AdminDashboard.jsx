import { AdminLayout } from '../components/Admin/AdminLayout';
import { VendorApprovalTable } from '../components/Admin/VendorApprovalTable';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="section-title">Duyệt gian hàng</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Phê duyệt hoặc từ chối hồ sơ Seller đăng ký mới
        </p>
      </div>

      <VendorApprovalTable />
    </AdminLayout>
  );
}
