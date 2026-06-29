import { Building2, Check, Mail, Phone, User, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function VendorApprovalRow({ vendor, onApprove, onReject }) {
  return (
    <>
      {/* Desktop table row */}
      <tr className="hidden border-b border-gray-100 last:border-0 md:table-row">
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="font-medium text-gray-900">{vendor.shopName}</span>
          </div>
        </td>
        <td className="px-4 py-4 text-gray-700">{vendor.fullName}</td>
        <td className="px-4 py-4 text-gray-600">{vendor.email}</td>
        <td className="px-4 py-4 text-gray-600">{vendor.phone}</td>
        <td className="px-4 py-4">
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600"
              onClick={() => onApprove(vendor.id)}
            >
              <Check className="h-3.5 w-3.5" />
              Duyệt
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
              onClick={() => onReject(vendor.id)}
            >
              <X className="h-3.5 w-3.5" />
              Từ chối
            </Button>
          </div>
        </td>
      </tr>

      {/* Mobile card */}
      <Card className="mb-3 md:hidden">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                <Building2 className="h-4 w-4 text-shopee" />
                {vendor.shopName}
              </p>
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Chờ duyệt
              </span>
            </div>
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-400" />
              {vendor.fullName}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              {vendor.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              {vendor.phone}
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onApprove(vendor.id)}
            >
              <Check className="h-3.5 w-3.5" />
              Duyệt
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => onReject(vendor.id)}
            >
              <X className="h-3.5 w-3.5" />
              Từ chối
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
