import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  Flag,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { reportApi } from '../../api/reportAPI';
import { cn } from '../../lib/utils';

const statusLabels = {
  NEW: 'Mới',
  REVIEWING: 'Đang xem xét',
  NEED_MORE_INFO: 'Cần thêm thông tin',
  VALID: 'Hợp lệ',
  REJECTED: 'Từ chối',
  ACTION_TAKEN: 'Đã xử lý',
  APPEALED: 'Đang khiếu nại',
  CLOSED: 'Đã đóng',
};

const priorityLabels = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  CRITICAL: 'Khẩn cấp',
};

const targetLabels = {
  PRODUCT: 'Bài đăng',
  VENDOR: 'Shop',
  CONVERSATION: 'Hội thoại',
};

const actionLabels = {
  NO_ACTION: 'Không xử lý',
  REJECT_REPORT: 'Từ chối báo cáo',
  WARNING: 'Cảnh báo shop',
  HIDE_PRODUCT: 'Ẩn sản phẩm',
  DISABLE_PROMOTION: 'Tắt quảng bá',
  RESTRICT_LISTING: 'Hạn chế đăng tin',
  RESTRICT_CHAT: 'Hạn chế chat',
  REQUIRE_VERIFICATION: 'Yêu cầu xác minh lại',
  TEMPORARY_SUSPENSION: 'Tạm khóa shop',
  PERMANENT_BAN: 'Khóa vĩnh viễn',
  RESTORE_PRODUCT: 'Khôi phục sản phẩm',
  RESTORE_PROMOTION: 'Khôi phục quảng bá',
  REMOVE_RESTRICTION: 'Gỡ hạn chế',
};

const statusOptions = ['NEW', 'REVIEWING', 'NEED_MORE_INFO', 'VALID', 'REJECTED', 'ACTION_TAKEN', 'APPEALED', 'CLOSED'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const targetOptions = ['PRODUCT', 'VENDOR', 'CONVERSATION'];
const actionOptions = ['NO_ACTION', 'REJECT_REPORT', 'WARNING', 'HIDE_PRODUCT', 'DISABLE_PROMOTION', 'RESTRICT_LISTING', 'RESTRICT_CHAT', 'REQUIRE_VERIFICATION', 'TEMPORARY_SUSPENSION', 'PERMANENT_BAN', 'RESTORE_PRODUCT', 'RESTORE_PROMOTION', 'REMOVE_RESTRICTION'];

function getPageContent(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

function getPageMeta(data) {
  if (Array.isArray(data)) return { totalPages: 1, totalElements: data.length, number: 0 };
  return {
    totalPages: Math.max(1, Number(data?.totalPages || 1)),
    totalElements: Number(data?.totalElements || 0),
    number: Number(data?.number || 0),
  };
}

function formatDate(value) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getApiMessage(error) {
  return error?.response?.data?.message || error?.message || 'Không thể xử lý yêu cầu.';
}

function StatusBadge({ status }) {
  const tone = {
    NEW: 'bg-orange-50 text-orange-700',
    REVIEWING: 'bg-blue-50 text-blue-700',
    NEED_MORE_INFO: 'bg-amber-50 text-amber-700',
    VALID: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    ACTION_TAKEN: 'bg-teal-50 text-teal-700',
    APPEALED: 'bg-violet-50 text-violet-700',
    CLOSED: 'bg-slate-100 text-slate-600',
  }[status] || 'bg-slate-100 text-slate-600';

  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold', tone)}>
      {statusLabels[status] || status || 'Chưa rõ'}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const tone = {
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-amber-50 text-amber-700',
    HIGH: 'bg-orange-50 text-orange-700',
    CRITICAL: 'bg-red-50 text-red-700',
  }[priority] || 'bg-slate-100 text-slate-600';

  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold', tone)}>
      {priorityLabels[priority] || priority || 'Thấp'}
    </span>
  );
}

function MetricCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.42)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', tone)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export function AdminReportModeration({ onToast }) {
  const [reportsPage, setReportsPage] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ query: '', status: '', priority: '', targetType: '' });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [nextStatus, setNextStatus] = useState('REVIEWING');
  const [actionType, setActionType] = useState('WARNING');
  const [actionNote, setActionNote] = useState('');

  const reports = useMemo(() => getPageContent(reportsPage), [reportsPage]);
  const meta = useMemo(() => getPageMeta(reportsPage), [reportsPage]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        size: 12,
        query: filters.query || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        targetType: filters.targetType || undefined,
      };
      const [statsResult, reportsResult] = await Promise.all([
        reportApi.getAdminReportStats().catch(() => null),
        reportApi.getAdminReports(params),
      ]);
      setStats(statsResult);
      setReportsPage(reportsResult);
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters.priority, filters.query, filters.status, filters.targetType, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectReport = async (report) => {
    setDetailLoading(true);
    setSelectedReport(report);
    setAdminNote('');
    setActionNote('');
    setNextStatus(report.status || 'REVIEWING');
    try {
      const detail = await reportApi.getAdminReportDetail(report.id);
      setSelectedReport(detail);
      setNextStatus(detail.status || 'REVIEWING');
    } catch (err) {
      onToast?.({ title: 'Không thể tải chi tiết', message: getApiMessage(err), tone: 'red' });
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!selectedReport?.id) return;
    setActionLoading(true);
    try {
      const detail = await reportApi.updateAdminReportStatus(selectedReport.id, {
        status: nextStatus,
        adminNote,
      });
      setSelectedReport(detail);
      onToast?.({ title: 'Đã cập nhật trạng thái', message: `Báo cáo #${selectedReport.id} đã chuyển trạng thái.`, tone: 'green' });
      await loadData();
    } catch (err) {
      onToast?.({ title: 'Cập nhật thất bại', message: getApiMessage(err), tone: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const applyAction = async () => {
    if (!selectedReport?.id) return;
    setActionLoading(true);
    try {
      const detail = await reportApi.applyAdminReportAction(selectedReport.id, {
        actionType,
        actionNote,
      });
      setSelectedReport(detail);
      onToast?.({ title: 'Đã áp dụng xử lý', message: actionLabels[actionType] || actionType, tone: 'green' });
      await loadData();
    } catch (err) {
      onToast?.({ title: 'Xử lý thất bại', message: getApiMessage(err), tone: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const reviewAppeal = async (appeal, decision) => {
    if (!selectedReport?.id || !appeal?.id) return;
    setActionLoading(true);
    try {
      const detail = await reportApi.reviewAppeal(selectedReport.id, appeal.id, {
        decision,
        reviewNote: adminNote,
        rollbackActions: decision === 'ACCEPTED',
      });
      setSelectedReport(detail);
      onToast?.({ title: 'Đã phản hồi khiếu nại', message: decision === 'ACCEPTED' ? 'Khiếu nại đã được chấp thuận.' : 'Khiếu nại đã bị từ chối.', tone: 'green' });
      await loadData();
    } catch (err) {
      onToast?.({ title: 'Không thể xử lý khiếu nại', message: getApiMessage(err), tone: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ query: '', status: '', priority: '', targetType: '' });
    setPage(0);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.46)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-700">
            <ShieldAlert className="h-3.5 w-3.5" />
            Kiểm duyệt report
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Trung tâm xử lý báo cáo</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Theo dõi báo cáo từ người mua, kiểm tra bằng chứng, áp dụng biện pháp xử lý và phản hồi khiếu nại của shop.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-60"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Làm mới
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Báo cáo mới" value={stats?.newCount ?? 0} icon={Flag} tone="bg-orange-50 text-orange-600" />
        <MetricCard label="Đang xử lý" value={stats?.reviewingCount ?? 0} icon={Loader2} tone="bg-blue-50 text-blue-600" />
        <MetricCard label="Ưu tiên cao" value={stats?.highPriorityCount ?? 0} icon={AlertTriangle} tone="bg-red-50 text-red-600" />
        <MetricCard label="Khiếu nại" value={stats?.appealedCount ?? 0} icon={ShieldCheck} tone="bg-violet-50 text-violet-600" />
      </section>

      <section className="rounded-3xl border border-white/80 bg-white p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.46)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.query}
              onChange={(event) => {
                setFilters((current) => ({ ...current, query: event.target.value }));
                setPage(0);
              }}
              placeholder="Tìm theo shop, nội dung, mã báo cáo..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>
          <select
            value={filters.status}
            onChange={(event) => {
              setFilters((current) => ({ ...current, status: event.target.value }));
              setPage(0);
            }}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
          <select
            value={filters.priority}
            onChange={(event) => {
              setFilters((current) => ({ ...current, priority: event.target.value }));
              setPage(0);
            }}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Tất cả mức độ</option>
            {priorityOptions.map((priority) => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
          </select>
          <select
            value={filters.targetType}
            onChange={(event) => {
              setFilters((current) => ({ ...current, targetType: event.target.value }));
              setPage(0);
            }}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Tất cả đối tượng</option>
            {targetOptions.map((target) => <option key={target} value={target}>{targetLabels[target]}</option>)}
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
          >
            Đặt lại
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.46)]">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-black text-slate-950">Danh sách báo cáo</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{meta.totalElements} bản ghi phù hợp</p>
          </div>
          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : reports.length ? (
            <div className="divide-y divide-slate-100">
              {reports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => selectReport(report)}
                  className={cn(
                    'flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-orange-50/45 sm:flex-row sm:items-center sm:justify-between',
                    selectedReport?.id === report.id && 'bg-orange-50/70',
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-950">#{report.id}</span>
                      <StatusBadge status={report.status} />
                      <PriorityBadge priority={report.priority} />
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-extrabold text-slate-800">
                      {report.reasonLabel || report.reasonCode || 'Lý do báo cáo'}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {targetLabels[report.targetType] || report.targetType} #{report.targetId} · {report.vendorShopName || 'Chưa rõ shop'} · {formatDate(report.createdAt)}
                    </p>
                  </div>
                  <Eye className="h-5 w-5 shrink-0 text-slate-300" />
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-14 text-center">
              <Flag className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-extrabold text-slate-800">Không có báo cáo phù hợp</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">Thay đổi bộ lọc hoặc làm mới dữ liệu.</p>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="text-xs font-bold text-slate-400">Trang {page + 1}/{meta.totalPages}</span>
            <button
              type="button"
              disabled={page >= meta.totalPages - 1}
              onClick={() => setPage((current) => Math.min(meta.totalPages - 1, current + 1))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>

        <aside className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.46)]">
          {selectedReport ? (
            <div>
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-600">Chi tiết report</p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">Báo cáo #{selectedReport.id}</h2>
                </div>
                <button type="button" onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {detailLoading ? (
                <div className="flex min-h-96 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="max-h-[calc(100vh-15rem)] space-y-5 overflow-y-auto p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black uppercase text-slate-400">Đối tượng</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-900">{targetLabels[selectedReport.targetType] || selectedReport.targetType}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black uppercase text-slate-400">Mức độ</p>
                      <p className="mt-1"><PriorityBadge priority={selectedReport.priority} /></p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black uppercase text-slate-400">Shop</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-900">{selectedReport.vendor?.shopName || selectedReport.vendorShopName || 'Chưa rõ'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black uppercase text-slate-400">Trạng thái</p>
                      <p className="mt-1"><StatusBadge status={selectedReport.status} /></p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Lý do</p>
                    <p className="mt-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-extrabold text-orange-800">
                      {selectedReport.reasonLabel || selectedReport.reasonCode}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Mô tả người báo cáo</p>
                    <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
                      {selectedReport.description || 'Không có mô tả bổ sung.'}
                    </p>
                  </div>

                  {selectedReport.product && (
                    <div className="rounded-2xl border border-slate-100 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Sản phẩm liên quan</p>
                      <p className="mt-2 text-sm font-extrabold text-slate-900">{selectedReport.product.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">ID #{selectedReport.product.id} · {selectedReport.product.status || 'Chưa rõ trạng thái'}</p>
                    </div>
                  )}

                  {(selectedReport.evidences || []).length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Bằng chứng</p>
                      <div className="mt-2 space-y-2">
                        {selectedReport.evidences.map((file) => (
                          <a
                            key={file.id}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-2xl border border-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <FileText className="h-4 w-4 text-orange-500" />
                            {file.fileName || file.fileUrl}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Cập nhật trạng thái</p>
                    <div className="mt-3 space-y-3">
                      <select
                        value={nextStatus}
                        onChange={(event) => setNextStatus(event.target.value)}
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      >
                        {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                      </select>
                      <textarea
                        value={adminNote}
                        onChange={(event) => setAdminNote(event.target.value)}
                        rows={3}
                        placeholder="Ghi chú nội bộ hoặc phản hồi khiếu nại..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      />
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={updateStatus}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Lưu trạng thái
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-orange-100 bg-orange-50/50 p-4">
                    <p className="text-sm font-black text-slate-950">Áp dụng biện pháp xử lý</p>
                    <div className="mt-3 space-y-3">
                      <select
                        value={actionType}
                        onChange={(event) => setActionType(event.target.value)}
                        className="h-11 w-full rounded-2xl border border-orange-100 bg-white px-3 text-sm font-bold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      >
                        {actionOptions.map((action) => <option key={action} value={action}>{actionLabels[action]}</option>)}
                      </select>
                      <textarea
                        value={actionNote}
                        onChange={(event) => setActionNote(event.target.value)}
                        rows={3}
                        placeholder="Lý do xử lý gửi vào audit log..."
                        className="w-full resize-none rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      />
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={applyAction}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff315c] to-[#ff6b2c] px-4 text-sm font-extrabold text-white shadow-lg shadow-orange-500/15 transition hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                        Áp dụng xử lý
                      </button>
                    </div>
                  </div>

                  {(selectedReport.appeals || []).length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Khiếu nại từ seller</p>
                      <div className="mt-2 space-y-3">
                        {selectedReport.appeals.map((appeal) => (
                          <div key={appeal.id} className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-black text-slate-900">Khiếu nại #{appeal.id}</p>
                              <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-violet-700">{appeal.status}</span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-600">{appeal.appealReason}</p>
                            {appeal.status === 'SUBMITTED' || appeal.status === 'REVIEWING' ? (
                              <div className="mt-3 flex gap-2">
                                <button type="button" disabled={actionLoading} onClick={() => reviewAppeal(appeal, 'ACCEPTED')} className="h-9 flex-1 rounded-xl bg-emerald-600 text-xs font-extrabold text-white">
                                  Chấp thuận
                                </button>
                                <button type="button" disabled={actionLoading} onClick={() => reviewAppeal(appeal, 'REJECTED')} className="h-9 flex-1 rounded-xl bg-red-600 text-xs font-extrabold text-white">
                                  Từ chối
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[560px] items-center justify-center p-8 text-center">
              <div>
                <Eye className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-extrabold text-slate-800">Chọn một báo cáo</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">Chi tiết, bằng chứng và thao tác xử lý sẽ hiển thị tại đây.</p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
