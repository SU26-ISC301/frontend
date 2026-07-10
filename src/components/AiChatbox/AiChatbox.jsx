import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ExternalLink,
  Loader2,
  Maximize2,
  MessageSquarePlus,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productAPI';
import { promotionApi } from '../../api/promotionAPI';
import { sellerApi } from '../../api/sellerAPI';
import { marketResearchApi } from '../../api/marketResearchAPI';
import { cn } from '../../lib/utils';
import {
  getSessionAccountKey,
  hasAuthenticatedSession,
  subscribeAuthSessionChanges,
} from '../../utils/authSession';

const MAX_CONTEXT_PRODUCTS = 80;
const STORAGE_PREFIX = 'shopvn:ai-chatbox';
const GUEST_QUESTION_LIMIT = 3;
const guestQuestionUsage = new Map();

function formatVnd(value) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} VND`;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getPageContent(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getProductPrice(product) {
  const prices = (product?.variants || [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  return prices.length ? Math.min(...prices) : 0;
}

function getPromotionRoi(item) {
  return Number(
    item?.roiPerClick
      ?? item?.promotion?.roiPerClick
      ?? item?.postPromotion?.roiPerClick
      ?? item?.promotion?.roiAmount
      ?? 0
  );
}

function getProductPath(productId) {
  return productId ? `/products/${productId}` : '';
}

function renderMessageContent(content, fromUser = false) {
  const text = String(content || '');
  const linkPattern = /\[([^\]]+)\]\((\/products\/\d+)\)/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <Link
        key={`${match[2]}-${match.index}`}
        to={match[2]}
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-black underline-offset-2 transition hover:underline',
          fromUser
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'bg-orange-50 text-orange-600 hover:bg-orange-100',
        )}
      >
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : text;
}

function makeId(prefix = 'chat') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createInitialSession(mode) {
  const now = new Date().toISOString();
  return {
    id: makeId(mode),
    title: mode === 'vendor' ? 'Phân tích shop mới' : 'Tư vấn mua hàng mới',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: makeId('msg'),
        role: 'assistant',
        createdAt: now,
        content:
          mode === 'vendor'
            ? 'Chào shop, mình là Chatbox AI. Mình có thể phân tích số dư, giao dịch, ROI từng bài quảng bá và gợi ý cách tối ưu ngân sách quảng cáo.'
            : 'Chào bạn, mình là Chatbox AI. Mình có thể gợi ý giá theo từ khóa, so sánh sản phẩm, tìm kiếm sản phẩm và gợi ý theo nhu cầu mua sắm.',
      },
    ],
  };
}

function getAiStorageKey(mode) {
  return `${STORAGE_PREFIX}:${getSessionAccountKey(mode)}`;
}

function readSessions(mode, authenticated = hasAuthenticatedSession(mode)) {
  if (!authenticated || typeof window === 'undefined') return [createInitialSession(mode)];
  try {
    const saved = JSON.parse(window.localStorage.getItem(getAiStorageKey(mode)) || '[]');
    return Array.isArray(saved) && saved.length ? saved : [createInitialSession(mode)];
  } catch {
    return [createInitialSession(mode)];
  }
}

function writeSessions(mode, sessions, authenticated = hasAuthenticatedSession(mode)) {
  if (!authenticated) return;
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getAiStorageKey(mode), JSON.stringify(sessions.slice(0, 30)));
}

function summarizeBuyerContext(products, query) {
  const normalizedQuery = normalizeText(query);
  const approvedProducts = products
    .filter((product) => !product.status || ['active', 'approved'].includes(normalizeText(product.status)))
    .map((product) => ({
      id: product.id,
      name: product.name,
      vendorName: product.vendorName,
      categoryName: product.categoryName,
      price: getProductPrice(product),
      rating: Number(product.avgRating || 0),
      soldCount: Number(product.soldCount || 0),
      promoted: Boolean(product.isPromoted || product.promotionId),
      roi: getPromotionRoi(product),
    }))
    .filter((product) => {
      if (!normalizedQuery) return true;
      const haystack = normalizeText(`${product.name} ${product.vendorName} ${product.categoryName}`);
      return normalizedQuery.split(/\s+/).some((word) => word && haystack.includes(word));
    });

  const sorted = [...approvedProducts].sort((left, right) => {
    const promotedDelta = Number(right.promoted) - Number(left.promoted);
    if (promotedDelta) return promotedDelta;
    const roiDelta = right.roi - left.roi;
    if (roiDelta) return roiDelta;
    return left.price - right.price;
  });

  const prices = sorted.map((product) => product.price).filter(Boolean);
  return { products: sorted, prices };
}

function buildBuyerAnswer(question, products, marketData) {
  const context = summarizeBuyerContext(products, question);
  const topProducts = context.products.slice(0, 5);
  const priceHint = context.prices.length
    ? `Khoảng giá mình thấy trong dữ liệu hiện tại là từ ${formatVnd(Math.min(...context.prices))} đến ${formatVnd(Math.max(...context.prices))}.`
    : 'Hiện chưa có đủ dữ liệu giá phù hợp với từ khóa này.';

  const marketHint = marketData?.priceRange || marketData?.suggestedPrice
    ? `Dữ liệu nghiên cứu thị trường gợi ý: ${marketData.priceRange || marketData.suggestedPrice}.`
    : '';

  if (!topProducts.length) {
    return [
      'Mình chưa tìm thấy sản phẩm khớp mạnh với nhu cầu này trong dữ liệu hiện tại.',
      'Bạn thử nhập rõ hơn tên sản phẩm, hãng, nhu cầu sử dụng hoặc khoảng ngân sách. Ví dụ: "tai nghe bluetooth dưới 500k" hoặc "điện thoại chụp ảnh tốt".',
    ].join('\n\n');
  }

  const productLines = topProducts
    .map((product, index) => {
      const productLink = getProductPath(product.id);
      return `${index + 1}. ${product.name} - ${formatVnd(product.price)}${product.vendorName ? `, shop ${product.vendorName}` : ''}${product.rating ? `, rating ${product.rating.toFixed(1)}` : ''}${productLink ? ` - [Xem sản phẩm](${productLink})` : ''}`;
    })
    .join('\n');

  return [
    priceHint,
    marketHint,
    'Mình ưu tiên sản phẩm đang được quảng bá trước, sau đó xét ROI/quy mô hiển thị và giá phù hợp.',
    `Gợi ý nổi bật:\n${productLines}`,
    'Nếu bạn muốn so sánh kỹ hơn, hãy hỏi theo dạng: "so sánh sản phẩm 1 và 2 theo giá, rating, nhu cầu".',
  ].filter(Boolean).join('\n\n');
}

function buildVendorAnswer(question, context) {
  const wallet = context.wallet || {};
  const promotions = Array.isArray(context.promotions) ? context.promotions : [];
  const transactions = Array.isArray(context.transactions) ? context.transactions : [];
  const products = Array.isArray(context.products) ? context.products : [];

  const availableBalance = Number(wallet.availableBalance ?? wallet.balance ?? 0);
  const lockedBalance = Number(wallet.lockedBalance ?? 0);
  const totalSpent = Number(wallet.totalSpent ?? 0);
  const activePromotions = promotions.filter((promotion) => ['active', 'scheduled', 'running'].includes(normalizeText(promotion.status)));
  const totalBudget = promotions.reduce((sum, promotion) => sum + Number(promotion.promotionAmount ?? promotion.budget ?? 0), 0);
  const totalRemaining = promotions.reduce((sum, promotion) => sum + Number(promotion.remainingBudget ?? 0), 0);
  const bestRoi = [...promotions].sort((a, b) => getPromotionRoi(b) - getPromotionRoi(a))[0];
  const recentTransactions = transactions.slice(0, 5);

  const promotionLines = activePromotions.slice(0, 5).map((promotion, index) => {
    const productId = promotion.productId || promotion.postId;
    const productName = promotion.productName || products.find((product) => Number(product.id) === Number(productId))?.name || `Bài #${productId || promotion.id}`;
    const productLink = getProductPath(productId);
    return `${index + 1}. ${productName}: ROI/lượt nhấp ${formatVnd(getPromotionRoi(promotion))}, còn ${formatVnd(promotion.remainingBudget || 0)}, trạng thái ${promotion.status || 'đang chạy'}${productLink ? ` - [Xem sản phẩm](${productLink})` : ''}`;
  });

  const transactionLines = recentTransactions.map((transaction, index) =>
    `${index + 1}. ${transaction.type || transaction.transactionType || 'Giao dịch'} ${formatVnd(transaction.amount || 0)} - ${transaction.status || 'N/A'}`
  );

  return [
    `Tổng quan tài chính: số dư khả dụng ${formatVnd(availableBalance)}, số dư đang khóa ${formatVnd(lockedBalance)}, tổng đã chi ${formatVnd(totalSpent)}.`,
    `Quảng bá: có ${promotions.length} chiến dịch, trong đó ${activePromotions.length} chiến dịch đang/sắp chạy. Tổng ngân sách ghi nhận ${formatVnd(totalBudget)}, còn lại ${formatVnd(totalRemaining)}.`,
    bestRoi ? `Bài có ROI/lượt nhấp cao nhất hiện là ${bestRoi.productName || `#${bestRoi.productId || bestRoi.id}`} với ${formatVnd(getPromotionRoi(bestRoi))}/lượt nhấp. Nếu ngân sách còn thấp, nên ưu tiên bài có tỷ lệ nhấp/chuyển đổi tốt thay vì chỉ tăng ROI.` : 'Chưa có dữ liệu ROI quảng bá để so sánh.',
    promotionLines.length ? `Một vài bài quảng bá cần theo dõi:\n${promotionLines.join('\n')}` : '',
    transactionLines.length ? `Giao dịch gần đây:\n${transactionLines.join('\n')}` : '',
    'Gợi ý vận hành: nếu số dư khả dụng thấp hơn ngân sách quảng bá dự kiến, hãy nạp trước rồi chạy chiến dịch nhỏ 1-3 ngày để đo lượt nhấp thực tế trước khi tăng ngân sách.',
  ].filter(Boolean).join('\n\n');
}

async function fetchAllPublicProducts(params = {}) {
  const firstPage = await productApi.getPublicProducts({ ...params, page: 0, size: 50 });
  const firstContent = getPageContent(firstPage);
  const totalPages = Math.min(Number(firstPage?.totalPages || 1), 4);
  if (totalPages <= 1) return firstContent;

  const pages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      productApi.getPublicProducts({ ...params, page: index + 1, size: 50 }).catch(() => null)
    )
  );

  return [...firstContent, ...pages.flatMap(getPageContent)];
}

async function getAiAnswer(mode, question) {
  if (mode === 'vendor') {
    const [walletResult, promotionsResult, transactionsResult, productsResult] = await Promise.allSettled([
      promotionApi.getAccountWallet(),
      promotionApi.getPromotions(),
      promotionApi.getWalletTransactions(20),
      sellerApi.getPublicProducts(),
    ]);

    return buildVendorAnswer(question, {
      wallet: walletResult.status === 'fulfilled' ? walletResult.value : null,
      promotions: promotionsResult.status === 'fulfilled' ? promotionsResult.value : [],
      transactions: transactionsResult.status === 'fulfilled' ? transactionsResult.value : [],
      products: productsResult.status === 'fulfilled' ? getPageContent(productsResult.value) : [],
    });
  }

  const keyword = question.trim().slice(0, 80);
  const [productsResult, marketResult] = await Promise.allSettled([
    fetchAllPublicProducts(keyword ? { keyword } : {}),
    marketResearchApi.getPublicProductMarketResearch({ query: keyword }).catch(() => null),
  ]);
  let buyerProducts = productsResult.status === 'fulfilled' ? productsResult.value : [];

  if (keyword && buyerProducts.length === 0) {
    buyerProducts = await fetchAllPublicProducts({}).catch(() => []);
  }

  return buildBuyerAnswer(
    question,
    buyerProducts.slice(0, MAX_CONTEXT_PRODUCTS),
    marketResult.status === 'fulfilled' ? marketResult.value : null,
  );
}

const buyerSuggestions = [
  'Gợi ý điện thoại chụp ảnh tốt dưới 10 triệu',
  'So sánh tai nghe bluetooth theo giá và nhu cầu học online',
  'Tìm laptop văn phòng pin tốt',
  'Khoảng giá hợp lý cho đồng hồ thông minh là bao nhiêu?',
];

const vendorSuggestions = [
  'Phân tích số dư và ngân sách quảng bá hiện tại',
  'Bài quảng bá nào có ROI/lượt nhấp cao nhất?',
  'Tôi nên nạp thêm bao nhiêu để chạy quảng cáo 7 ngày?',
  'Đánh giá hiệu quả các bài đang quảng bá',
];

function AiChatboxPanel({ mode = 'buyer', variant = 'page' }) {
  const [authState, setAuthState] = useState(() => ({
    authenticated: hasAuthenticatedSession(mode),
    accountKey: getSessionAccountKey(mode),
  }));
  const [sessions, setSessions] = useState(() => readSessions(mode, authState.authenticated));
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestQuestionCount, setGuestQuestionCount] = useState(() => guestQuestionUsage.get(mode) || 0);
  const listRef = useRef(null);
  const isVendor = mode === 'vendor';
  const isPopup = variant === 'popup';
  const suggestions = isVendor ? vendorSuggestions : buyerSuggestions;
  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0];
  const guestQuestionsLeft = Math.max(0, GUEST_QUESTION_LIMIT - guestQuestionCount);
  const guestLimitReached = !authState.authenticated && guestQuestionsLeft <= 0;

  useEffect(() => {
    writeSessions(mode, sessions, authState.authenticated);
  }, [authState.authenticated, authState.accountKey, mode, sessions]);

  useEffect(() => {
    return subscribeAuthSessionChanges(() => {
      const nextState = {
        authenticated: hasAuthenticatedSession(mode),
        accountKey: getSessionAccountKey(mode),
      };
      setAuthState((current) => {
        if (
          current.authenticated === nextState.authenticated &&
          current.accountKey === nextState.accountKey
        ) {
          return current;
        }
        const nextSessions = readSessions(mode, nextState.authenticated);
        setSessions(nextSessions);
        setActiveSessionId(nextSessions[0]?.id || null);
        setMessage('');
        setLoading(false);
        setGuestQuestionCount(guestQuestionUsage.get(mode) || 0);
        return nextState;
      });
    });
  }, [mode]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [activeSessionId, activeSession?.messages?.length, loading]);

  const updateSession = useCallback((sessionId, updater) => {
    setSessions((current) =>
      current.map((session) => (session.id === sessionId ? updater(session) : session))
    );
  }, []);

  const createSession = () => {
    const session = createInitialSession(mode);
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.id);
    setMessage('');
  };

  const deleteSession = (sessionId) => {
    setSessions((current) => {
      const next = current.filter((session) => session.id !== sessionId);
      if (sessionId === activeSessionId) {
        setActiveSessionId(next[0]?.id || null);
      }
      return next.length ? next : [createInitialSession(mode)];
    });
  };

  const sendPrompt = async (prompt = message) => {
    const content = prompt.trim();
    if (!content || loading) return;
    if (guestLimitReached) {
      return;
    }

    let targetSession = activeSession;
    if (!targetSession) {
      targetSession = createInitialSession(mode);
      setSessions([targetSession]);
      setActiveSessionId(targetSession.id);
    }

    const now = new Date().toISOString();
    const userMessage = { id: makeId('msg'), role: 'user', content, createdAt: now };
    setMessage('');
    setLoading(true);
    if (!authState.authenticated) {
      setGuestQuestionCount((current) => {
        const next = current + 1;
        guestQuestionUsage.set(mode, next);
        return next;
      });
    }

    updateSession(targetSession.id, (session) => ({
      ...session,
      title: session.messages.length <= 1 ? content.slice(0, 54) : session.title,
      updatedAt: now,
      messages: [...session.messages, userMessage],
    }));

    try {
      const answer = await getAiAnswer(mode, content);
      updateSession(targetSession.id, (session) => ({
        ...session,
        updatedAt: new Date().toISOString(),
        messages: [
          ...session.messages,
          {
            id: makeId('msg'),
            role: 'assistant',
            content: answer,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (error) {
      updateSession(targetSession.id, (session) => ({
        ...session,
        updatedAt: new Date().toISOString(),
        messages: [
          ...session.messages,
          {
            id: makeId('msg'),
            role: 'assistant',
            content: `Mình chưa lấy được dữ liệu hệ thống lúc này: ${error?.response?.data?.message || error?.message || 'không rõ lỗi'}. Bạn thử lại sau vài giây nhé.`,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn('grid overflow-hidden bg-white', isPopup ? 'h-full min-h-0 grid-cols-[250px_minmax(0,1fr)]' : 'min-h-[720px] rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 lg:grid-cols-[320px_minmax(0,1fr)]')}>
      <aside className="flex min-h-0 flex-col border-r border-slate-100 bg-slate-50/80">
        <div className={cn('border-b border-slate-100 bg-white', isPopup ? 'p-3' : 'p-4')}>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
            {isVendor ? 'AI người bán' : 'AI người mua'}
          </p>
          <h2 className={cn('mt-1 font-black text-slate-950', isPopup ? 'text-xl' : 'text-2xl')}>Chatbox AI</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {isVendor ? 'Phân tích tài chính, ROI và quảng bá.' : 'Tìm kiếm, so sánh và gợi ý mua hàng.'}
          </p>
          {!authState.authenticated && (
            <p className="mt-2 rounded-2xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">
              Khách dùng thử còn {guestQuestionsLeft}/{GUEST_QUESTION_LIMIT} câu hỏi.
            </p>
          )}
          <button
            type="button"
            onClick={createSession}
            disabled={guestLimitReached}
            className={cn('inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600', isPopup ? 'mt-3 h-10' : 'mt-4 h-11')}
          >
            <MessageSquarePlus className="h-4 w-4" />
            Cuộc trò chuyện mới
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {sessions.map((session) => {
            const active = session.id === activeSession?.id;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => setActiveSessionId(session.id)}
                className={cn('mb-2 flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition', active ? 'border-orange-200 bg-orange-50' : 'border-transparent bg-white hover:border-slate-200')}
              >
                <Bot className={cn('mt-0.5 h-5 w-5 shrink-0', active ? 'text-orange-500' : 'text-slate-400')} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-slate-800">{session.title}</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-400">
                    {session.messages.length} tin nhắn
                  </span>
                </span>
                {sessions.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 hover:bg-white hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-col">
        <div className={cn('shrink-0 flex items-center justify-between border-b border-slate-100', isPopup ? 'px-4 py-3' : 'px-5 py-4')}>
          <div className="flex min-w-0 items-center gap-3">
            <div className={cn('flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20', isPopup ? 'h-10 w-10' : 'h-12 w-12')}>
              <Sparkles className={cn(isPopup ? 'h-5 w-5' : 'h-6 w-6')} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black text-slate-950">{activeSession?.title || 'Chatbox AI'}</p>
              <p className="text-xs font-bold text-emerald-600">
                Đang dùng dữ liệu thật từ hệ thống ShopVN
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 sm:inline-flex">
            <BarChart3 className="h-4 w-4" />
            {isVendor ? 'Phân tích người bán' : 'Trợ lý người mua'}
          </span>
        </div>

        <div ref={listRef} className={cn('min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,#f8fafc_0%,#fff7ed_100%)]', isPopup ? 'p-4' : 'p-5')}>
          {activeSession?.messages.map((item) => {
            const fromUser = item.role === 'user';
            return (
              <div key={item.id} className={cn('flex gap-3', fromUser ? 'justify-end' : 'justify-start')}>
                {!fromUser && (
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                    <Bot className="h-5 w-5" />
                  </span>
                )}
                <div className={cn('max-w-[78%] rounded-3xl px-4 py-3 text-sm font-semibold shadow-sm', fromUser ? 'rounded-br-lg bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'rounded-bl-lg border border-slate-100 bg-white text-slate-700')}>
                  <p className="whitespace-pre-wrap leading-7">{renderMessageContent(item.content, fromUser)}</p>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
              Chatbox AI đang phân tích dữ liệu...
            </div>
          )}
        </div>

        <div className={cn('shrink-0 border-t border-slate-100 bg-white', isPopup ? 'p-3' : 'p-4')}>
          <div className="mb-3 flex gap-2 overflow-x-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendPrompt(suggestion)}
                disabled={guestLimitReached || loading}
                className="shrink-0 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {suggestion}
              </button>
            ))}
          </div>
          {guestLimitReached && (
            <p className="mb-3 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">
              Bạn đã dùng hết 3 câu hỏi miễn phí. Đăng nhập để tiếp tục trò chuyện và lưu lịch sử theo tài khoản.
            </p>
          )}
          <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2 focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="ml-2 mt-3 h-5 w-5 shrink-0 text-slate-400" />
            <textarea
              value={message}
              rows={1}
              maxLength={2000}
              disabled={guestLimitReached}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return;
                event.preventDefault();
                sendPrompt();
              }}
              placeholder={guestLimitReached ? 'Đăng nhập để tiếp tục dùng Chatbox AI...' : isVendor ? 'Hỏi AI về tài chính, ROI, hiệu quả quảng bá...' : 'Hỏi AI về giá, so sánh, tìm sản phẩm theo nhu cầu...'}
              className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled={loading || guestLimitReached || !message.trim()}
              onClick={() => sendPrompt()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Gửi câu hỏi AI"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}

export function AiChatboxPage({ mode = 'buyer' }) {
  return <AiChatboxPanel mode={mode} variant="page" />;
}

export function AiChatboxLauncher({ mode = 'buyer', fullPagePath }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const launcherRef = useRef(null);
  const navigate = useNavigate();

  const openFullPage = () => {
    if (!fullPagePath) {
      setExpanded((current) => !current);
      return;
    }
    navigate(fullPagePath);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (launcherRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={launcherRef} className="fixed bottom-40 right-6 z-[100]">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="premium-glow-hover group flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-white/92 text-[#db3417] shadow-xl shadow-orange-500/15 ring-1 ring-orange-100 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white"
          aria-label="Mở chatbox AI"
          title="Chatbox AI"
        >
          <Bot className="h-8 w-8" strokeWidth={2.2} />
        </button>
      )}

      {open && (
        <div className={cn(
          'premium-panel-dark fixed right-4 top-1/2 flex h-[min(calc(100vh-2rem),660px)] -translate-y-1/2 flex-col overflow-hidden rounded-[1.4rem] sm:right-6',
          expanded ? 'w-[min(calc(100vw-2rem),1080px)]' : 'w-[min(calc(100vw-2rem),880px)]'
        )}>
          <div className="grid h-14 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/10">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black tracking-normal text-white">Chatbox AI</h2>
                <p className="truncate text-xs font-bold text-white/55">
                  {mode === 'vendor' ? 'Trợ lý người bán' : 'Trợ lý người mua'}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={openFullPage}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Mở trang chatbox AI"
                title="Mở trang chatbox AI"
              >
                {fullPagePath ? <ExternalLink className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Phóng to chatbox AI"
                title="Phóng to chatbox AI"
              >
                {expanded ? <ChevronLeft className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500 hover:text-white"
                aria-label="Đóng chatbox AI"
                title="Đóng chatbox AI"
              >
                <X className="h-7 w-7" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 bg-white">
            <AiChatboxPanel mode={mode} variant="popup" />
          </div>
        </div>
      )}
    </div>
  );
}
