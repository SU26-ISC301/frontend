import { useState } from 'react';
import { Lock, LogIn, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { sellerApi } from '../../api/sellerAPI';
import { ForgotPasswordForm } from '../Auth/ForgotPasswordForm';
import { getRememberedLogin, removeRememberedLogin, saveRememberedLogin } from '../../utils/rememberLogin';

export function SellerLogin({ onSwitchToRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [rememberedIdentifier, setRememberedIdentifier] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'identifier') {
      const remembered = getRememberedLogin('vendor', value);
      setForm((prev) => ({
        ...prev,
        identifier: value,
        password: remembered?.password || (rememberedIdentifier ? '' : prev.password),
      }));
      setRememberLogin(Boolean(remembered));
      setRememberedIdentifier(remembered ? value : '');
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) {
      next.identifier = 'Vui lòng nhập email hoặc số điện thoại';
    }
    if (!form.password) {
      next.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const getApiMessage = (err) =>
    err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Đăng nhập thất bại';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');
    try {
      const data = await sellerApi.login({
        identifier: form.identifier.trim(),
        password: form.password,
      });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('vendorAccessToken', data.accessToken);
      localStorage.setItem('vendorRefreshToken', data.refreshToken);
      localStorage.setItem('vendorInfo', JSON.stringify(data));
      if (rememberLogin) {
        saveRememberedLogin('vendor', form.identifier, form.password);
      } else {
        removeRememberedLogin('vendor', form.identifier);
      }
      navigate('/vendor/trangchu');
    } catch (err) {
      setApiError(getApiMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <Card className="mx-auto max-w-md border border-white/90 bg-white/[0.96] text-slate-950 shadow-[0_28px_80px_-46px_rgba(15,23,42,0.95)] ring-1 ring-orange-100/70">
        <CardHeader className="text-center">
          <CardTitle className="text-slate-950">Quên mật khẩu người bán</CardTitle>
          <p className="text-sm font-medium text-slate-500">Xác thực OTP email để đặt lại mật khẩu</p>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm onBackToLogin={() => setIsForgotPassword(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md border border-white/90 bg-white/[0.96] text-slate-950 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.95)] ring-1 ring-orange-100/80">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-[0_18px_38px_-18px_rgba(255,77,46,0.92)]">
          <LogIn className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-slate-950">Đăng nhập người bán</CardTitle>
        <p className="text-sm font-medium text-slate-500">
          Đăng nhập để quản lý shop và đơn hàng của bạn
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {apiError}
            </div>
          )}
          <Input
            label="Email hoặc Số điện thoại"
            name="identifier"
            placeholder="nguoi-ban@email.com hoặc 09xxxxxxxx"
            value={form.identifier}
            onChange={handleChange}
            error={errors.identifier}
            labelClassName="text-slate-700"
            className="border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-[#ff6b45] focus:ring-orange-100"
          />
          <div className="relative">
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              labelClassName="text-slate-700"
              className="border-slate-200 bg-white pr-10 text-slate-950 placeholder:text-slate-400 focus:border-[#ff6b45] focus:ring-orange-100"
            />
            <Lock className="pointer-events-none absolute right-3 top-[2.125rem] h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 font-medium text-slate-600">
              <input
                type="checkbox"
                className="rounded border-slate-300 accent-[#ff5a2f]"
                checked={rememberLogin}
                onChange={(event) => setRememberLogin(event.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="button"
              className="font-medium text-shopee hover:text-shopee-hover"
              onClick={() => setIsForgotPassword(true)}
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <Mail className="h-4 w-4" />
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 font-semibold text-slate-500">hoặc</span>
          </div>
        </div>

        <p className="text-center text-sm font-medium text-slate-600">
          Chưa có tài khoản người bán?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="inline-flex items-center gap-1 font-semibold text-shopee hover:text-shopee-hover"
          >
            <Phone className="h-3.5 w-3.5" />
            Đăng ký ngay
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
