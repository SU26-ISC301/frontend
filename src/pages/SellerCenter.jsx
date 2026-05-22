import { useState } from 'react';
import { cn } from '../lib/utils';
import { SellerLayout } from '../components/Seller/SellerLayout';
import { SellerLogin } from '../components/Seller/SellerLogin';
import { SellerRegister } from '../components/Seller/SellerRegister';

const TABS = {
  LOGIN: 'login',
  REGISTER: 'register',
};

export default function SellerCenter() {
  const [tab, setTab] = useState(TABS.LOGIN);

  return (
    <SellerLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Chào mừng đến Seller Center
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Đăng nhập hoặc đăng ký để bắt đầu bán hàng trên sàn
        </p>
      </div>

      {/* Tab switcher — ẩn khi đang ở flow đăng ký nhiều bước nếu cần; giữ luôn cho UX */}
      <div className="mx-auto mb-6 flex max-w-md rounded-lg bg-white p-1 shadow-sm ring-1 ring-gray-200">
        <button
          type="button"
          onClick={() => setTab(TABS.LOGIN)}
          className={cn(
            'flex-1 rounded-md py-2.5 text-sm font-medium transition-colors',
            tab === TABS.LOGIN
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setTab(TABS.REGISTER)}
          className={cn(
            'flex-1 rounded-md py-2.5 text-sm font-medium transition-colors',
            tab === TABS.REGISTER
              ? 'bg-shopee text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          Đăng ký Seller
        </button>
      </div>

      {tab === TABS.LOGIN ? (
        <SellerLogin onSwitchToRegister={() => setTab(TABS.REGISTER)} />
      ) : (
        <SellerRegister onSwitchToLogin={() => setTab(TABS.LOGIN)} />
      )}
    </SellerLayout>
  );
}
