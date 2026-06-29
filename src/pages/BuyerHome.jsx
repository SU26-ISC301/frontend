import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Bell,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  Home,
  ImagePlus,
  KeyRound,
  Loader2,
  LogOut,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  ShoppingBag,
  Star,
  TicketPercent,
  Truck,
  User,
  WalletCards,
} from 'lucide-react';
import { Header } from '../components/Home/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DateInput } from '../components/ui/date-input';
import { Modal } from '../components/ui/modal';
import { ChatWorkspace } from '../components/Messaging/ChatWorkspace';
import { MessageLauncher } from '../components/Messaging/MessageLauncher';
import { AiChatboxLauncher, AiChatboxPage } from '../components/AiChatbox/AiChatbox';
import { authApi } from '../api/authAPI';
import { buyerMessageApi } from '../api/buyerMessageAPI';
import { cn } from '../lib/utils';
import { getAvatarSrc } from '../utils/avatar';

const navItems = [
  { slug: 'tong-quan', label: 'Tổng quan', icon: Home },
  { slug: 'don-mua', label: 'Đơn mua', icon: ShoppingBag },
  { slug: 'thong-tin', label: 'Thông tin người dùng', icon: User },
  { slug: 'dia-chi', label: 'Sổ địa chỉ', icon: MapPin },
  { slug: 'vi-voucher', label: 'Ví & Voucher', icon: WalletCards },
  { slug: 'danh-gia', label: 'Đánh giá', icon: Star },
  { slug: 'ho-tro', label: 'Hỗ trợ', icon: MessageSquareText },
  { slug: 'chatbox-ai', label: 'Chatbox AI', icon: Bot },
  { slug: 'bao-mat', label: 'Bảo mật', icon: ShieldCheck },
];

const pageTitles = {
  'tong-quan': 'Tổng quan tài khoản',
  'don-mua': 'Đơn mua của tôi',
  'thong-tin': 'Thông tin người dùng',
  'dia-chi': 'Sổ địa chỉ',
  'vi-voucher': 'Ví & Voucher',
  'danh-gia': 'Đánh giá sản phẩm',
  'ho-tro': 'Trung tâm hỗ trợ',
  'chatbox-ai': 'Chatbox AI',
  'bao-mat': 'Bảo mật tài khoản',
};

const orderTabs = ['Chờ xác nhận', 'Đang giao', 'Đã giao', 'Đổi trả'];
const orders = [
  { id: 'ORD-58291', product: 'Áo khoác chống nắng UV', status: 'Đang giao', total: '389.000đ', eta: 'Dự kiến hôm nay' },
  { id: 'ORD-58214', product: 'Set son tint 3 màu', status: 'Đã giao', total: '259.000đ', eta: 'Đã nhận 24/05' },
  { id: 'ORD-58177', product: 'Bình giữ nhiệt 750ml', status: 'Chờ xác nhận', total: '189.000đ', eta: 'Shop đang xử lý' },
];

function getApiMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Có lỗi xảy ra';
}

function unwrap(response) {
  return response.data?.data ?? response.data;
}

function formatDateInput(value) {
  if (!value) return '';
  return value.slice(0, 10);
}

function BuyerLayout({ profile, activeSlug, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('buyerAccessToken');
    localStorage.removeItem('buyerRefreshToken');
    localStorage.removeItem('vendorInfo');
    window.dispatchEvent(new CustomEvent('buyer-auth-changed', { detail: { loggedIn: false } }));
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="page-mesh min-h-screen">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarSrc(profile?.avatarUrl)}
                alt={profile?.fullName || 'Người mua'}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-bold text-gray-950">{profile?.fullName || 'Tài khoản người mua'}</p>
                <p className="truncate text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </div>

          <nav className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
            {navItems.map(({ slug, label, icon: Icon }) => (
              <NavLink
                key={slug}
                to={`/buyer/${slug}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive ? 'bg-shopee-light text-shopee' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 border-t border-gray-100 px-3 py-2.5 pt-4 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </nav>
        </aside>

        <section className="min-w-0 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500">Tài khoản mua hàng</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-950">{pageTitles[activeSlug]}</h1>
          </div>
          {children}
        </section>
      </main>
      <Footer />
      <AiChatboxLauncher mode="buyer" fullPagePath="/buyer/chatbox-ai" />
      <MessageLauncher mode="buyer" />
    </div>
  );
}

function OverviewPage({ profile }) {
  const cards = [
    { label: 'Đơn đang giao', value: '2', icon: Truck, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Voucher khả dụng', value: '12', icon: TicketPercent, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Điểm tích lũy', value: '8.420', icon: Star, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Thông báo mới', value: '5', icon: Bell, tone: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <span className={cn('mb-4 flex h-10 w-10 items-center justify-center rounded-lg', tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <SectionHeader title="Đơn hàng gần đây" action="Xem tất cả" to="/buyer/don-mua" />
          <OrderList />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <SectionHeader title="Hồ sơ của bạn" action="Cập nhật" to="/buyer/thong-tin" />
          <div className="flex items-center gap-4">
            <img src={getAvatarSrc(profile?.avatarUrl)} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <p className="font-bold">{profile?.fullName}</p>
              <p className="text-sm text-gray-500">{profile?.phone || 'Chưa có số điện thoại'}</p>
              <p className="text-sm text-gray-500">{formatDateInput(profile?.dateOfBirth) || 'Chưa có ngày sinh'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ title, action, to }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-bold text-gray-950">{title}</h2>
      {action && (
        <NavLink to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-shopee">
          {action}
          <ChevronRight className="h-4 w-4" />
        </NavLink>
      )}
    </div>
  );
}

function OrderList() {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="flex flex-col gap-3 rounded-lg border border-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{order.product}</p>
            <p className="mt-1 text-sm text-gray-500">{order.id} · {order.eta}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-bold">{order.total}</p>
            <p className="text-sm text-shopee">{order.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {orderTabs.map((tab, index) => (
          <button key={tab} className={cn('shrink-0 rounded-lg px-3 py-2 text-sm font-semibold', index === 0 ? 'bg-shopee text-white' : 'bg-gray-100 text-gray-600')}>
            {tab}
          </button>
        ))}
      </div>
      <OrderList />
    </div>
  );
}

function SimplePanel({ icon: Icon, title, desc, items }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-shopee-light text-shopee">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold text-gray-950">{title}</h2>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <button key={item} className="rounded-lg border border-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:border-shopee/40 hover:bg-shopee-light/40">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ profile, onProfileUpdated }) {
  const initialForm = useMemo(() => ({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    dateOfBirth: formatDateInput(profile?.dateOfBirth),
  }), [profile]);
  const [form, setForm] = useState(initialForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTarget, setOtpTarget] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const contactChanged = form.email.trim().toLowerCase() !== (profile?.email || '')
    || form.phone.trim() !== (profile?.phone || '');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
    setOtpSent(false);
    setOtp('');
  };

  const handleAvatar = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh đại diện phải dưới 5MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WEBP');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
  };

  const startCamera = async () => {
    try {
      setCameraReady(false);
      setCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setCameraStream(stream);
    } catch {
      setCameraOpen(false);
      setError('Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStream(null);
    setCameraReady(false);
    setCameraOpen(false);
  };

  useEffect(() => {
    if (!cameraOpen || !cameraStream || !videoRef.current) return undefined;

    const video = videoRef.current;
    video.srcObject = cameraStream;
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        setError('Không thể phát camera. Vui lòng đóng rồi mở lại camera.');
      });
    }

    return () => {
      if (video.srcObject) video.srcObject = null;
    };
  }, [cameraOpen, cameraStream]);

  const captureAvatar = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!cameraReady || !video.videoWidth || !video.videoHeight) {
      setError('Camera chưa sẵn sàng, vui lòng thử lại sau vài giây.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      handleAvatar(new File([blob], `buyer-avatar-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const requestOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authApi.requestProfileUpdateOtp(form);
      const data = unwrap(response);
      setOtpTarget(data?.otpTarget || form.email);
      setOtpSent(true);
      setSuccess('OTP đã được gửi. Vui lòng kiểm tra email để xác thực thay đổi.');
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!form.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    if (!form.email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!form.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!form.dateOfBirth) {
      setError('Vui lòng chọn ngày sinh');
      return;
    }
    if (contactChanged && !otpSent) {
      await requestOtp();
      return;
    }
    if (contactChanged && !otp.trim()) {
      setError('Vui lòng nhập OTP xác thực thay đổi');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let updatedProfile = unwrap(await authApi.updateCurrentProfile({ ...form, otp }));
      if (avatarFile) {
        updatedProfile = unwrap(await authApi.uploadAvatar(avatarFile));
      }
      onProfileUpdated(updatedProfile);
      setAvatarFile(null);
      setAvatarPreview('');
      setOtpSent(false);
      setOtp('');
      setSuccess('Cập nhật thông tin thành công');
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={saveProfile} className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm">
          <img
            src={avatarPreview || getAvatarSrc(profile?.avatarUrl)}
            alt="Ảnh đại diện"
            className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-shopee-light"
          />
          <p className="mt-4 text-sm text-gray-500">JPG, PNG, WEBP dưới 5MB</p>
          <div className="mt-4 grid gap-2">
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm font-semibold text-brand-dark hover:bg-shopee-light">
              <ImagePlus className="h-4 w-4" />
              Tải ảnh lên
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleAvatar(e.target.files?.[0])} />
            </label>
            <Button type="button" variant="outline" onClick={startCamera}>
              <Camera className="h-4 w-4" />
              Chụp ảnh
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} />
            <DateInput label="Ngày tháng năm sinh" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} min="1900-01-01" max={new Date().toISOString().split('T')[0]} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Số điện thoại" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </div>

          {contactChanged && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-700">Email hoặc số điện thoại đã thay đổi, cần OTP để xác thực.</p>
                  {otpSent && <p className="mt-1 text-xs text-orange-700">OTP đã gửi đến {otpTarget}</p>}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={requestOtp} disabled={loading}>
                  {otpSent ? 'Gửi lại OTP' : 'Gửi OTP'}
                </Button>
              </div>
              {otpSent && (
                <Input
                  className="mt-3"
                  label="Mã OTP"
                  name="otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              )}
            </div>
          )}

          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">{error}</div>}
          {success && <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">{success}</div>}

          <div className="mt-5 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {contactChanged && !otpSent ? 'Gửi OTP xác thực' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </form>

      <Modal open={cameraOpen} onClose={stopCamera} title="Chụp ảnh đại diện">
        <div className="space-y-4 px-6 pb-6">
          <div className="relative overflow-hidden rounded-lg bg-gray-950">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => setCameraReady(true)}
              className="aspect-video w-full object-cover"
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-sm font-semibold text-white/80">
                Đang mở camera...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={captureAvatar} disabled={!cameraReady}>
              <Camera className="h-4 w-4" />
              Chụp ảnh
            </Button>
            <Button className="flex-1" variant="outline" onClick={stopCamera}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function BuyerMessagesPage() {
  const [vendors, setVendors] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [startingVendorId, setStartingVendorId] = useState(null);
  const [error, setError] = useState('');
  const activeChat = conversations.find((conversation) => conversation.id === activeConversationId);

  const loadConversations = useCallback(async () => {
    try {
      const data = await buyerMessageApi.getConversations();
      const nextConversations = Array.isArray(data) ? data : [];
      setConversations(nextConversations);
      setActiveConversationId((current) => (
        current && nextConversations.some((conversation) => conversation.id === current)
          ? current
          : nextConversations[0]?.id ?? null
      ));
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const loadVendors = useCallback(async () => {
    try {
      const data = await buyerMessageApi.getVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(getApiMessage(requestError));
    }
  }, []);

  const loadMessages = useCallback(async (conversationId, silent = false) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    if (!silent) setLoadingMessages(true);
    try {
      const data = await buyerMessageApi.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
      setConversations((current) => current.map((conversation) => (
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )));
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    loadVendors();
    const intervalId = setInterval(loadConversations, 15000);
    return () => clearInterval(intervalId);
  }, [loadConversations, loadVendors]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return undefined;
    }
    loadMessages(activeConversationId);
    const intervalId = setInterval(() => loadMessages(activeConversationId, true), 10000);
    return () => clearInterval(intervalId);
  }, [activeConversationId, loadMessages]);

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setConversations((current) => current.map((conversation) => (
      conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
    )));
  };

  const startConversation = async (vendorId) => {
    setStartingVendorId(vendorId);
    try {
      const conversation = await buyerMessageApi.startConversation(vendorId);
      await loadConversations();
      setActiveConversationId(conversation.id);
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setStartingVendorId(null);
    }
  };

  const sendMessage = async () => {
    const content = message.trim();
    if (!content || !activeChat || sending) return;
    setSending(true);
    try {
      const sentMessage = await buyerMessageApi.sendMessage(activeChat.id, content);
      setMessages((current) => current.some((item) => item.id === sentMessage.id)
        ? current
        : [...current, sentMessage]);
      setMessage('');
      await loadConversations();
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  return (
    <ChatWorkspace
      mode="buyer"
      conversations={conversations}
      activeConversationId={activeConversationId}
      messages={messages}
      message={message}
      loadingConversations={loadingConversations}
      loadingMessages={loadingMessages}
      sending={sending}
      error={error}
      directory={vendors}
      startingId={startingVendorId}
      onRefresh={loadConversations}
      onSelectConversation={selectConversation}
      onStartConversation={startConversation}
      onMessageChange={setMessage}
      onSend={sendMessage}
    />
  );
}

const pageComponents = {
  'tong-quan': OverviewPage,
  'don-mua': OrdersPage,
  'thong-tin': ProfilePage,
  'dia-chi': (props) => <SimplePanel {...props} icon={MapPin} title="Sổ địa chỉ" desc="Quản lý địa chỉ giao hàng thường dùng." items={['Nhà riêng · Hóc Môn, TP Hồ Chí Minh', 'Văn phòng · Quận 1, TP Hồ Chí Minh', 'Thêm địa chỉ mới', 'Đặt địa chỉ mặc định']} />,
  'vi-voucher': (props) => <SimplePanel {...props} icon={TicketPercent} title="Ví & Voucher" desc="Theo dõi ví, điểm thưởng và mã giảm giá." items={['12 voucher đang có', '8.420 điểm tích lũy', 'Hoàn tiền đang chờ', 'Lịch sử sử dụng voucher']} />,
  'danh-gia': (props) => <SimplePanel {...props} icon={Star} title="Đánh giá" desc="Các sản phẩm bạn đã mua và có thể đánh giá." items={['3 sản phẩm chờ đánh giá', 'Ảnh/video đã tải lên', 'Đánh giá 5 sao gần đây', 'Lịch sử nhận xu đánh giá']} />,
  'ho-tro': BuyerMessagesPage,
  'chatbox-ai': () => <AiChatboxPage mode="buyer" />,
  'bao-mat': (props) => <SimplePanel {...props} icon={KeyRound} title="Bảo mật" desc="Quản lý đăng nhập, thiết bị và bảo vệ tài khoản." items={['Đổi mật khẩu', 'Thiết bị đã đăng nhập', 'Xác thực email', 'Nhật ký bảo mật']} />,
};

export default function BuyerHome() {
  const { section = 'tong-quan' } = useParams();
  const Page = pageComponents[section];
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    authApi.getMe()
      .then((response) => {
        if (!mounted) return;
        setProfile(response.data?.data || response.data);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Vui lòng đăng nhập để xem tài khoản người mua');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Page) return <Navigate to="/buyer/tong-quan" replace />;
  if (loading) {
    return (
      <div className="page-mesh min-h-screen">
        <Header />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24">
          <Loader2 className="h-8 w-8 animate-spin text-shopee" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="page-mesh min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="rounded-lg bg-white p-5 font-semibold text-gray-700 shadow-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <BuyerLayout profile={profile} activeSlug={section}>
      <Page profile={profile} onProfileUpdated={setProfile} />
    </BuyerLayout>
  );
}
