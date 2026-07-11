import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock3,
  Loader2,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  UserRound,
} from 'lucide-react';
import { cn } from '../../lib/utils';

function formatChatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return new Intl.DateTimeFormat(
    'vi-VN',
    sameDay ? { hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: '2-digit' },
  ).format(date);
}

function getInitials(value = 'Shop') {
  return String(value)
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getConversationName(conversation, mode) {
  if (!conversation) return '';
  return mode === 'vendor'
    ? conversation.customerName || conversation.customerEmail || 'Khách hàng'
    : conversation.shopName || conversation.vendorName || 'Shop';
}

function getConversationSubtitle(conversation, mode) {
  if (!conversation) return '';
  if (mode === 'vendor') return conversation.customerEmail || 'Khách đang trao đổi';
  return conversation.vendorCategory || 'Shop đã xác minh';
}

function isMessageFromMe(message, mode) {
  return mode === 'vendor' ? message.sentByVendor : message.sentByBuyer;
}

const buyerQuickReplies = [
  'Shop ơi sản phẩm này còn hàng không?',
  'Mình muốn hỏi thêm về bảo hành.',
  'Mình muốn xem thêm ảnh thật của sản phẩm.',
  'Bạn tư vấn giúp mình sản phẩm phù hợp nhé.',
];

const vendorQuickReplies = [
  'Dạ sản phẩm vẫn còn hàng ạ.',
  'Shop có thể gửi thêm ảnh/video thật cho bạn.',
  'Bạn cần xem thêm thông tin nào của sản phẩm ạ?',
  'Mình có thể hẹn thời gian trao đổi trực tiếp phù hợp.',
];

const MAX_QUICK_REPLIES = 10;

function sanitizeQuickReplies(replies = []) {
  return replies
    .map((reply) => String(reply || '').trim())
    .filter(Boolean)
    .slice(0, MAX_QUICK_REPLIES);
}

function getSavedQuickReplies(mode, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = window.localStorage.getItem(`shopvn:${mode}:quick-replies`);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    const replies = Array.isArray(parsed) ? sanitizeQuickReplies(parsed) : [];
    return replies.length > 0 ? replies : fallback;
  } catch {
    return fallback;
  }
}

export function ChatWorkspace({
  mode = 'buyer',
  variant = 'page',
  conversations = [],
  activeConversationId = null,
  messages = [],
  message = '',
  loadingConversations = false,
  loadingMessages = false,
  sending = false,
  error = '',
  directory = [],
  startingId = null,
  onRefresh,
  onSelectConversation,
  onStartConversation,
  onMessageChange,
  onSend,
}) {
  const [query, setQuery] = useState('');
  const messageListRef = useRef(null);
  const isVendor = mode === 'vendor';
  const isPopup = variant === 'popup';
  const accent = isVendor ? 'teal' : 'orange';
  const activeChat = conversations.find((conversation) => conversation.id === activeConversationId);
  const defaultQuickReplies = useMemo(
    () => (isVendor ? vendorQuickReplies : buyerQuickReplies),
    [isVendor],
  );
  const [quickReplies, setQuickReplies] = useState(() => getSavedQuickReplies(mode, defaultQuickReplies));
  const [quickReplyDraft, setQuickReplyDraft] = useState('');
  const displayQuickReplies = useMemo(() => sanitizeQuickReplies(quickReplies), [quickReplies]);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return conversations;
    return conversations.filter((conversation) =>
      [
        getConversationName(conversation, mode),
        getConversationSubtitle(conversation, mode),
        conversation.lastMessage,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [conversations, mode, query]);

  useEffect(() => {
    setQuickReplies(getSavedQuickReplies(mode, defaultQuickReplies));
    setQuickReplyDraft('');
  }, [defaultQuickReplies, mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(`shopvn:${mode}:quick-replies`, JSON.stringify(sanitizeQuickReplies(quickReplies)));
  }, [mode, quickReplies]);

  useEffect(() => {
    const node = messageListRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, activeConversationId, loadingMessages]);

  const sendCurrentMessage = () => {
    if (!message.trim() || sending || !activeChat) return;
    onSend?.();
  };

  const handleComposerKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    if (event.shiftKey) return;
    event.preventDefault();
    sendCurrentMessage();
  };

  const updateQuickReply = (index, nextValue) => {
    setQuickReplies((current) =>
      current.map((reply, replyIndex) => (replyIndex === index ? nextValue : reply)),
    );
  };

  const removeQuickReply = (index) => {
    setQuickReplies((current) => current.filter((_, replyIndex) => replyIndex !== index));
  };

  const addQuickReply = () => {
    const nextReply = quickReplyDraft.trim();
    if (!nextReply || displayQuickReplies.length >= MAX_QUICK_REPLIES) return;
    setQuickReplies((current) => sanitizeQuickReplies([...current, nextReply]));
    setQuickReplyDraft('');
  };

  return (
    <section className={cn(
      'overflow-hidden bg-white',
      isPopup
        ? 'h-full rounded-none border-0 shadow-none'
        : 'h-[calc(100vh-13.25rem)] min-h-[520px] rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5',
    )}>
      <div className={cn(
        'grid min-h-0',
        isPopup
          ? 'h-full min-h-0 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_260px]'
          : 'h-full lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_270px]',
      )}>
        <aside className={cn(
          'flex flex-col border-b border-slate-100 bg-slate-50/70 lg:border-b-0 lg:border-r',
          'min-h-0',
        )}>
          <div className="border-b border-slate-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${isVendor ? 'text-teal-600' : 'text-orange-600'}`}>
                  {isVendor ? 'Tin nhắn người bán' : 'Tin nhắn với shop'}
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Tin nhắn</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {conversations.length} hội thoại đang theo dõi
                </p>
              </div>
              <button
                type="button"
                aria-label="Tải lại hội thoại"
                onClick={onRefresh}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              >
                <RefreshCw className={cn('h-4 w-4', loadingConversations && 'animate-spin')} />
              </button>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm hội thoại, khách, shop..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {error && (
              <p className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {loadingConversations && conversations.length === 0 && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />
                ))}
              </div>
            )}

            {!loadingConversations && conversations.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
                <MessageSquareText className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-extrabold text-slate-800">Chưa có hội thoại</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                  {isVendor ? 'Tin nhắn mới từ khách sẽ xuất hiện tại đây.' : 'Chọn một shop để bắt đầu trao đổi.'}
                </p>
              </div>
            )}

            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              const displayName = getConversationName(conversation, mode);
              const unreadCount = Number(conversation.unreadCount || 0);

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelectConversation?.(conversation.id)}
                  className={cn(
                    'mb-2 flex w-full gap-3 rounded-3xl border p-3 text-left transition',
                    isActive
                      ? accent === 'teal'
                        ? 'border-teal-200 bg-teal-50 shadow-sm'
                        : 'border-orange-200 bg-orange-50 shadow-sm'
                      : 'border-transparent bg-white hover:border-slate-200 hover:shadow-sm',
                  )}
                >
                  <span
                    className={cn(
                      'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-sm',
                      accent === 'teal' ? 'bg-teal-700' : 'bg-gradient-to-br from-orange-500 to-red-500',
                    )}
                  >
                    {getInitials(displayName)}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-black text-slate-900">{displayName}</span>
                      <span className="shrink-0 text-[11px] font-bold text-slate-400">
                        {formatChatTime(conversation.lastMessageAt)}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs font-semibold text-slate-500">
                      {conversation.lastMessage || 'Chưa có tin nhắn'}
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        <ShieldCheck className="h-3 w-3" />
                        {isVendor ? 'Khách hàng' : 'Shop'}
                      </span>
                      {unreadCount > 0 && (
                        <span
                          className={cn(
                            'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black text-white',
                            accent === 'teal' ? 'bg-teal-600' : 'bg-orange-500',
                          )}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col bg-white">
          {activeChat ? (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white',
                      accent === 'teal' ? 'bg-teal-700' : 'bg-gradient-to-br from-orange-500 to-red-500',
                    )}
                  >
                    {getInitials(getConversationName(activeChat, mode))}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-slate-950">
                      {getConversationName(activeChat, mode)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Đang hoạt động
                      <span className="text-slate-300">·</span>
                      <span className="truncate text-slate-400">{getConversationSubtitle(activeChat, mode)}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Tùy chọn hội thoại"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div ref={messageListRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#fff7ed_100%)] p-5">
                <div className="mx-auto max-w-md rounded-2xl bg-white/80 px-4 py-2 text-center text-xs font-bold text-slate-400 shadow-sm">
                  Tin nhắn được lưu theo hội thoại. Hãy giữ trao đổi lịch sự và rõ ràng.
                </div>

                {loadingMessages && (
                  <div className="flex justify-center py-10">
                    <Loader2 className={cn('h-6 w-6 animate-spin', accent === 'teal' ? 'text-teal-600' : 'text-orange-500')} />
                  </div>
                )}

                {!loadingMessages && messages.length === 0 && (
                  <div className="flex min-h-[320px] items-center justify-center text-center">
                    <div>
                      <MessageCircle className="mx-auto h-12 w-12 text-slate-300" />
                      <p className="mt-3 text-sm font-black text-slate-800">
                        Bắt đầu cuộc trò chuyện
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {isVendor ? 'Gửi phản hồi đầu tiên để chăm sóc khách.' : 'Gửi lời chào hoặc câu hỏi cho shop.'}
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((item) => {
                  const fromMe = isMessageFromMe(item, mode);
                  return (
                    <div key={item.id} className={cn('flex gap-2', fromMe ? 'justify-end' : 'justify-start')}>
                      {!fromMe && (
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-slate-500 shadow-sm">
                          {getInitials(getConversationName(activeChat, mode))}
                        </span>
                      )}
                      <div
                        className={cn(
                          'max-w-[78%] rounded-3xl px-4 py-3 text-sm font-semibold shadow-sm',
                          fromMe
                            ? accent === 'teal'
                              ? 'rounded-br-lg bg-teal-700 text-white'
                              : 'rounded-br-lg bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'rounded-bl-lg border border-slate-100 bg-white text-slate-700',
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{item.content}</p>
                        <p className={cn('mt-1 text-[10px] font-bold', fromMe ? 'text-white/75' : 'text-slate-400')}>
                          {formatChatTime(item.createdAt)}
                          {fromMe && <span className="ml-1">· Đã gửi</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 bg-white p-4">
                <div className="mb-3 flex gap-2 overflow-x-auto">
                  {displayQuickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => onMessageChange?.(reply)}
                      className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2 focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                  <textarea
                    value={message}
                    maxLength={2000}
                    disabled={sending}
                    onChange={(event) => onMessageChange?.(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={1}
                    placeholder="Nhập tin nhắn..."
                    className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    aria-label="Gửi tin nhắn"
                    disabled={sending || !message.trim()}
                    onClick={sendCurrentMessage}
                    className={cn(
                      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-45',
                      accent === 'teal'
                        ? 'bg-teal-700 shadow-teal-700/20 hover:bg-teal-800'
                        : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-500/20 hover:brightness-105',
                    )}
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div className="max-w-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-500">
                  <MessageSquareText className="h-10 w-10" />
                </div>
                <p className="mt-5 text-lg font-black text-slate-900">Chọn một hội thoại</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {isVendor
                    ? 'Nội dung trao đổi với khách hàng sẽ hiển thị tại đây.'
                    : 'Hoặc bắt đầu trò chuyện với shop ở danh sách bên cạnh.'}
                </p>
              </div>
            </div>
          )}
        </main>

        <aside className="hidden min-h-0 border-l border-slate-100 bg-white xl:flex xl:flex-col">
          <div className="border-b border-slate-100 p-5">
            <p className="text-sm font-black text-slate-950">
              {isVendor ? 'Công cụ trả lời' : 'Shop gợi ý'}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {isVendor ? 'Tăng tốc chăm sóc khách hàng.' : 'Bắt đầu trao đổi với gian hàng.'}
            </p>
          </div>

          {isVendor ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <div className="rounded-3xl border border-orange-100 bg-orange-50/50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">Tin nhắn sẵn</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Cấu hình tối đa {MAX_QUICK_REPLIES} câu trả lời nhanh.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-orange-600">
                    {displayQuickReplies.length}/{MAX_QUICK_REPLIES}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {quickReplies.map((reply, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-orange-500" />
                      <input
                        value={reply}
                        maxLength={160}
                        onChange={(event) => updateQuickReply(index, event.target.value)}
                        onBlur={() => setQuickReplies((current) => sanitizeQuickReplies(current))}
                        className="min-w-0 flex-1 rounded-2xl border border-white bg-white px-3 py-2 text-xs font-bold text-slate-600 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                        placeholder="Nhập tin nhắn sẵn..."
                      />
                      <button
                        type="button"
                        aria-label="Xóa tin nhắn sẵn"
                        onClick={() => removeQuickReply(index)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {displayQuickReplies.length < MAX_QUICK_REPLIES && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        value={quickReplyDraft}
                        maxLength={160}
                        onChange={(event) => setQuickReplyDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter') return;
                          event.preventDefault();
                          addQuickReply();
                        }}
                        className="min-w-0 flex-1 rounded-2xl border border-orange-100 bg-white px-3 py-2 text-xs font-bold text-slate-600 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                        placeholder="Thêm tin nhắn sẵn..."
                      />
                      <button
                        type="button"
                        onClick={addQuickReply}
                        disabled={!quickReplyDraft.trim()}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Thêm tin nhắn sẵn"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {displayQuickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  disabled={!activeChat}
                  onClick={() => onMessageChange?.(reply)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left text-sm font-bold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>{reply}</span>
                </button>
              ))}

              <div className="rounded-3xl bg-teal-50 p-4">
                <PackageCheck className="h-6 w-6 text-teal-700" />
                <p className="mt-3 text-sm font-black text-teal-900">Gợi ý vận hành</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-teal-700">
                  Trả lời trong 15 phút đầu giúp tăng tỷ lệ chốt đơn và điểm shop.
                </p>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-4 rounded-3xl border border-orange-100 bg-orange-50/50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">Tin nhắn sẵn</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Cấu hình tối đa {MAX_QUICK_REPLIES} câu hỏi nhanh.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-orange-600">
                    {displayQuickReplies.length}/{MAX_QUICK_REPLIES}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {quickReplies.map((reply, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-orange-500" />
                      <input
                        value={reply}
                        maxLength={160}
                        onChange={(event) => updateQuickReply(index, event.target.value)}
                        onBlur={() => setQuickReplies((current) => sanitizeQuickReplies(current))}
                        className="min-w-0 flex-1 rounded-2xl border border-white bg-white px-3 py-2 text-xs font-bold text-slate-600 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                        placeholder="Nhập tin nhắn sẵn..."
                      />
                      <button
                        type="button"
                        aria-label="Xóa tin nhắn sẵn"
                        onClick={() => removeQuickReply(index)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {displayQuickReplies.length < MAX_QUICK_REPLIES && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        value={quickReplyDraft}
                        maxLength={160}
                        onChange={(event) => setQuickReplyDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter') return;
                          event.preventDefault();
                          addQuickReply();
                        }}
                        className="min-w-0 flex-1 rounded-2xl border border-orange-100 bg-white px-3 py-2 text-xs font-bold text-slate-600 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                        placeholder="Thêm tin nhắn sẵn..."
                      />
                      <button
                        type="button"
                        onClick={addQuickReply}
                        disabled={!quickReplyDraft.trim()}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Thêm tin nhắn sẵn"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {directory.map((vendor) => {
                  const existingConversation = conversations.find((conversation) => conversation.vendorId === vendor.id);
                  return (
                    <button
                      key={vendor.id}
                      type="button"
                      disabled={startingId === vendor.id}
                      onClick={() => onStartConversation?.(vendor.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 p-3 text-left transition hover:border-orange-200 hover:bg-orange-50 disabled:opacity-60"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                        <Store className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black text-slate-800">{vendor.shopName}</span>
                        <span className="mt-0.5 block text-xs font-semibold text-slate-400">
                          {existingConversation ? 'Mở hội thoại' : 'Bắt đầu trò chuyện'}
                        </span>
                      </span>
                      {startingId === vendor.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                      ) : (
                        <Plus className="h-4 w-4 text-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {directory.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center">
                  <UserRound className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-400">Chưa có shop khả dụng.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto border-t border-slate-100 p-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <Clock3 className="h-5 w-5 text-slate-400" />
              <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
                Hệ thống tự làm mới hội thoại định kỳ để bạn không bỏ lỡ tin mới.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
