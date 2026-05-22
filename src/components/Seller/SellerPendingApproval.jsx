import { Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function SellerPendingApproval({ onBackToLogin }) {
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardContent className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <Clock className="h-7 w-7 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Tài khoản đang chờ phê duyệt
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
          Hồ sơ đăng ký Seller của bạn đã được gửi thành công. Admin sẽ xem xét
          và phê duyệt trong vòng 1–3 ngày làm việc. Bạn sẽ nhận thông báo qua
          email khi được duyệt.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={onBackToLogin}
        >
          Quay về đăng nhập
        </Button>
      </CardContent>
    </Card>
  );
}
