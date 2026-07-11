import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, MessageCircle, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buyerMessageApi } from '../../api/buyerMessageAPI';
import { vendorMessageApi } from '../../api/vendorMessageAPI';
import { ChatWorkspace } from './ChatWorkspace';
import { cn } from '../../lib/utils';
import {
  hasAuthenticatedSession,
  subscribeAuthSessionChanges,
} from '../../utils/authSession';

const FLOATING_WIDGET_EVENT = 'shopvn-floating-widget-change';
const WIDGET_NAME = 'message';

function getApiMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể tải tin nhắn';
}

export function MessageLauncher({ mode = 'buyer' }) {
  const navigate = useNavigate();
  const launcherRef = useRef(null);
  const previousOpenRef = useRef(false);
  const isVendor = mode === 'vendor';
  const api = isVendor ? vendorMessageApi : buyerMessageApi;
  const [authenticated, setAuthenticated] = useState(() => hasAuthenticatedSession(mode));
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [startingVendorId, setStartingVendorId] = useState(null);
  const [error, setError] = useState('');
  const activeChat = conversations.find((conversation) => conversation.id === activeConversationId);

  useEffect(() => {
    return subscribeAuthSessionChanges(() => {
      const nextAuthenticated = hasAuthenticatedSession(mode);
      setAuthenticated(nextAuthenticated);
      if (!nextAuthenticated) {
        setOpen(false);
        setVendors([]);
        setConversations([]);
        setActiveConversationId(null);
        setMessages([]);
        setMessage('');
        setError('');
      }
    });
  }, [mode]);

  const unreadCount = useMemo(
    () => conversations.reduce((sum, conversation) => sum + Number(conversation.unreadCount || 0), 0),
    [conversations],
  );

  const loadConversations = useCallback(async () => {
    if (!authenticated) return;
    setLoadingConversations(true);
    try {
      const data = await api.getConversations();
      const nextConversations = Array.isArray(data) ? data : [];
      setConversations(nextConversations);
      setActiveConversationId((current) =>
        current && nextConversations.some((conversation) => conversation.id === current)
          ? current
          : nextConversations[0]?.id ?? null,
      );
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setLoadingConversations(false);
    }
  }, [api, authenticated]);

  const loadVendors = useCallback(async () => {
    if (!authenticated) return;
    if (isVendor || !buyerMessageApi.getVendors) return;
    try {
      const data = await buyerMessageApi.getVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(getApiMessage(requestError));
    }
  }, [authenticated, isVendor]);

  const loadMessages = useCallback(async (conversationId, silent = false) => {
    if (!authenticated) return;
    if (!conversationId) {
      setMessages([]);
      return;
    }
    if (!silent) setLoadingMessages(true);
    try {
      const data = await api.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
        ),
      );
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [api, authenticated]);

  useEffect(() => {
    if (!authenticated) return undefined;
    loadConversations();
    if (!isVendor) loadVendors();
    const intervalId = window.setInterval(loadConversations, open ? 10000 : 30000);
    return () => window.clearInterval(intervalId);
  }, [authenticated, isVendor, loadConversations, loadVendors, open]);

  useEffect(() => {
    if (!open || !activeConversationId) return undefined;
    loadMessages(activeConversationId);
    const intervalId = window.setInterval(() => loadMessages(activeConversationId, true), 10000);
    return () => window.clearInterval(intervalId);
  }, [activeConversationId, loadMessages, open]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (launcherRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    const handleFloatingWidgetChange = (event) => {
      const { widget, mode: eventMode, open: eventOpen } = event.detail || {};

      if (eventMode !== mode || widget === WIDGET_NAME) return;

      if (eventOpen) {
        setOpen(false);
        setExpanded(false);
        setSuppressed(true);
        return;
      }

      setSuppressed(false);
    };

    window.addEventListener(FLOATING_WIDGET_EVENT, handleFloatingWidgetChange);
    return () => window.removeEventListener(FLOATING_WIDGET_EVENT, handleFloatingWidgetChange);
  }, [mode]);

  useEffect(() => {
    if (previousOpenRef.current === open) return;

    previousOpenRef.current = open;
    window.dispatchEvent(new CustomEvent(FLOATING_WIDGET_EVENT, {
      detail: { widget: WIDGET_NAME, mode, open },
    }));
  }, [mode, open]);

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
      ),
    );
  };

  const startConversation = async (vendorId) => {
    if (!authenticated) return;
    setStartingVendorId(vendorId);
    try {
      const conversation = await buyerMessageApi.startConversation(vendorId);
      await loadConversations();
      setActiveConversationId(conversation.id);
      setOpen(true);
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setStartingVendorId(null);
    }
  };

  const sendMessage = async () => {
    const content = message.trim();
    if (!authenticated || !content || !activeChat || sending) return;
    setSending(true);
    try {
      const sentMessage = await api.sendMessage(activeChat.id, content);
      setMessages((current) =>
        current.some((item) => item.id === sentMessage.id) ? current : [...current, sentMessage],
      );
      setMessage('');
      await loadConversations();
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  const openFullPage = () => {
    navigate(isVendor ? '/vendor/tin-nhan' : '/buyer/ho-tro');
    setOpen(false);
    setExpanded(false);
  };

  if (!authenticated) {
    return null;
  }

  return (
    <div ref={launcherRef} className="fixed bottom-24 right-6 z-[80]">
      {!open && !suppressed && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="premium-glow-hover group flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-white/92 text-[#db3417] shadow-xl shadow-orange-500/15 ring-1 ring-orange-100 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white"
          aria-label="Mở tin nhắn"
        >
          <span className="relative flex h-11 w-11 items-center justify-center">
            <MessageCircle className="h-8 w-8" strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute -bottom-1 -right-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-black text-white ring-4 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </span>
        </button>
      )}

      {open && (
        <div className={cn(
          'premium-panel-dark fixed right-4 top-1/2 flex -translate-y-1/2 flex-col overflow-hidden rounded-[1.6rem] sm:right-6',
          expanded
            ? 'h-[min(calc(100vh-2rem),820px)] w-[min(calc(100vw-2rem),1180px)]'
            : 'h-[min(calc(100vh-2rem),720px)] w-[min(calc(100vw-2rem),980px)]'
        )}>
          <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-5 text-white">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-normal">Tin nhắn</h2>
              {unreadCount > 0 && (
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#ff304c] px-2 text-sm font-black">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isVendor ? (
                <>
                  <button
                    type="button"
                    onClick={openFullPage}
                    className="popup-window-action inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                    aria-label="Phóng to tin nhắn"
                    title="Phóng to"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setExpanded(false);
                    }}
                    className="popup-window-action inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                    aria-label="Thu nhỏ tin nhắn"
                    title="Thu nhỏ"
                  >
                    <Minus className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setExpanded(false);
                    }}
                    className="popup-window-action is-danger inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500 hover:text-white"
                    aria-label="Tắt tin nhắn"
                    title="Tắt"
                  >
                    <X className="h-7 w-7" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setExpanded(false);
                  }}
                  className="popup-window-action is-danger inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500 hover:text-white"
                  aria-label="Đóng tin nhắn"
                  title="Đóng"
                >
                  <X className="h-7 w-7" />
                </button>
              )}
            </div>
          </div>
          <div className="min-h-0 flex-1 bg-white">
            <ChatWorkspace
              mode={mode}
              variant="popup"
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
          </div>
        </div>
      )}
    </div>
  );
}
