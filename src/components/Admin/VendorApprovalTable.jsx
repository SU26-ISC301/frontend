import { useState } from 'react';
import { ClipboardList, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { VendorApprovalRow } from './VendorApprovalRow';

export function VendorApprovalTable({
  initialVendors = [],
  onApprove,
  onReject,
}) {
  const [vendors, setVendors] = useState(
    initialVendors.filter((v) => v.status === 'pending')
  );

  const handleApprove = (id) => {
    const vendor = vendors.find((v) => v.id === id);
    setVendors((prev) => prev.filter((v) => v.id !== id));
    onApprove?.(vendor);
    console.log('Đã duyệt người bán:', id);
  };

  const handleReject = (id) => {
    const vendor = vendors.find((v) => v.id === id);
    setVendors((prev) => prev.filter((v) => v.id !== id));
    onReject?.(vendor);
    console.log('Đã từ chối người bán:', id);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Duyệt gian hàng người bán</CardTitle>
            <p className="text-sm text-gray-500">
              Danh sách đăng ký đang chờ phê duyệt
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          {vendors.length} chờ duyệt
        </span>
      </CardHeader>

      <CardContent className="p-0 pb-0 sm:p-0">
        {vendors.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-y border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Tên Shop</th>
                    <th className="px-4 py-3">Họ Tên</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">SĐT</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <VendorApprovalRow
                      key={vendor.id}
                      vendor={vendor}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="px-4 pb-4 md:hidden">
              {vendors.map((vendor) => (
                <VendorApprovalRow
                  key={vendor.id}
                  vendor={vendor}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Inbox className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-900">Không có hồ sơ chờ duyệt</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">
        Tất cả đăng ký người bán đã được xử lý. Hồ sơ mới sẽ hiển thị tại đây.
      </p>
    </div>
  );
}
