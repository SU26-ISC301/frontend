import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileUp, Flag, Loader2, ShieldCheck, X } from 'lucide-react';
import { reportApi } from '../../api/reportAPI';
import { cn } from '../../lib/utils';

const fallbackReasons = [
  { reasonCode: 'MISLEADING_LISTING', label: 'Sản phẩm/bài đăng sai mô tả', defaultPriority: 'MEDIUM' },
  { reasonCode: 'FAKE_OR_COUNTERFEIT', label: 'Nghi ngờ hàng giả/hàng nhái', defaultPriority: 'HIGH' },
  { reasonCode: 'SCAM_OR_FRAUD', label: 'Người bán có dấu hiệu lừa đảo', defaultPriority: 'HIGH' },
  { reasonCode: 'OFF_PLATFORM_TRANSACTION', label: 'Lôi kéo giao dịch ngoài sàn', defaultPriority: 'HIGH' },
  { reasonCode: 'SPAM_OR_HARASSMENT', label: 'Spam hoặc gây phiền trong chat', defaultPriority: 'MEDIUM' },
  { reasonCode: 'ABUSIVE_LANGUAGE', label: 'Ngôn từ xúc phạm/đe dọa', defaultPriority: 'HIGH' },
  { reasonCode: 'FALSE_INFORMATION', label: 'Shop dùng thông tin/hình ảnh sai sự thật', defaultPriority: 'MEDIUM' },
  { reasonCode: 'PROHIBITED_ITEM', label: 'Sản phẩm bị cấm/hạn chế', defaultPriority: 'HIGH' },
  { reasonCode: 'PRICE_OR_PROMOTION_MISLEADING', label: 'Giá/khuyến mãi gây hiểu nhầm', defaultPriority: 'MEDIUM' },
  { reasonCode: 'IMPERSONATION', label: 'Mạo danh shop/người bán khác', defaultPriority: 'HIGH' },
  { reasonCode: 'OTHER', label: 'Khác', defaultPriority: 'LOW' },
];

const targetLabels = {
  PRODUCT: 'bài đăng',
  VENDOR: 'shop',
  CONVERSATION: 'hội thoại',
};

function getApiMessage(error) {
  return error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
}

export function ReportDialog({
  open,
  onClose,
  targetType,
  targetId,
  targetLabel,
  onSubmitted,
}) {
  const [reasons, setReasons] = useState(fallbackReasons);
  const [reasonCode, setReasonCode] = useState(fallbackReasons[0].reasonCode);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [confirmTruthful, setConfirmTruthful] = useState(true);
  const [loadingReasons, setLoadingReasons] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const selectedReason = useMemo(
    () => reasons.find((reason) => reason.reasonCode === reasonCode) || reasons[0],
    [reasonCode, reasons],
  );

  useEffect(() => {
    if (!open) return;
    setError('');
    setSuccess(null);
    setDescription('');
    setFiles([]);
    setConfirmTruthful(true);

    let mounted = true;
    setLoadingReasons(true);
    reportApi.getReasons()
      .then((data) => {
        const nextReasons = Array.isArray(data) && data.length ? data : fallbackReasons;
        if (!mounted) return;
        setReasons(nextReasons);
        setReasonCode(nextReasons[0]?.reasonCode || fallbackReasons[0].reasonCode);
      })
      .catch(() => {
        if (!mounted) return;
        setReasons(fallbackReasons);
        setReasonCode(fallbackReasons[0].reasonCode);
      })
      .finally(() => {
        if (mounted) setLoadingReasons(false);
      });

    return () => {
      mounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape' && !submitting) onClose?.();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEscape);
    };
  }, [open, onClose, submitting]);

  if (!open) return null;

  const handleFiles = (event) => {
    const nextFiles = Array.from(event.target.files || []).slice(0, 5);
    setFiles(nextFiles);
  };

  const submitReport = async (event) => {
    event.preventDefault();
    setError('');

    if (!targetType || !targetId) {
      setError('Không xác định được đối tượng cần báo cáo.');
      return;
    }

    if (!reasonCode) {
      setError('Vui lòng chọn lý do báo cáo.');
      return;
    }

    if (reasonCode === 'OTHER' && description.trim().length < 10) {
      setError('Vui lòng mô tả rõ hơn khi chọn lý do khác.');
      return;
    }

    if (!confirmTruthful) {
      setError('Bạn cần xác nhận thông tin báo cáo là trung thực.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await reportApi.createReport({
        targetType,
        targetId,
        reasonCode,
        description: description.trim(),
        confirmTruthful,
      }, files);
      setSuccess(result);
      onSubmitted?.(result);
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const targetName = targetLabels[targetType] || 'nội dung';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        aria-label="Đóng báo cáo"
        onClick={() => !submitting && onClose?.()}
      />
      <form
        onSubmit={submitReport}
        className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-[min(800px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.4rem] border border-white/80 bg-white shadow-[0_34px_90px_-44px_rgba(15,23,42,0.72)]"
      >
        <div className="relative shrink-0 overflow-hidden bg-[#12252f] px-5 py-3.5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,107,44,0.32),transparent_22rem),radial-gradient(circle_at_90%_20%,rgba(20,184,166,0.24),transparent_20rem)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-100">
                <Flag className="h-3.5 w-3.5" />
                Báo cáo vi phạm
              </p>
              <h2 className="mt-2 text-xl font-black tracking-normal sm:text-2xl">Gửi báo cáo {targetName}</h2>
              <p className="mt-1.5 max-w-xl text-sm font-semibold leading-6 text-white/70">
                {targetLabel || 'Nội dung bạn chọn'} sẽ được chuyển tới đội kiểm duyệt ShopVN cùng bằng chứng đính kèm.
              </p>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {success ? (
          <div className="overflow-y-auto p-5 sm:p-6">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-center">
              <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" />
              <h3 className="mt-3 text-lg font-black text-slate-950">Đã gửi báo cáo</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Mã báo cáo #{success?.id || '--'} đã được ghi nhận. Bạn có thể theo dõi trạng thái trong trung tâm người mua khi backend mở dữ liệu tương ứng.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff315c] to-[#ff6b2c] px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-0 space-y-4 overflow-y-auto p-4 sm:p-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {reasons.map((reason) => (
                <button
                  key={reason.reasonCode}
                  type="button"
                  onClick={() => setReasonCode(reason.reasonCode)}
                  className={cn(
                    'rounded-2xl border px-4 py-3 text-left transition hover:border-orange-200 hover:bg-orange-50/60',
                    reasonCode === reason.reasonCode
                      ? 'border-orange-300 bg-orange-50 shadow-lg shadow-orange-500/10'
                      : 'border-slate-200 bg-white',
                  )}
                >
                  <span className="block text-sm font-black leading-snug text-slate-900">{reason.label}</span>
                </button>
              ))}
            </div>

            {loadingReasons && (
              <p className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang đồng bộ lý do báo cáo từ backend...
              </p>
            )}

            <div>
              <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Mô tả bổ sung
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={1200}
                rows={4}
                placeholder={`Mô tả ngắn gọn điều bất thường của ${targetName}...`}
                className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
              <p className="mt-1 text-right text-[11px] font-bold text-slate-400">{description.length}/1200</p>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50/45 px-4 py-5 text-center transition hover:border-orange-300 hover:bg-orange-50">
              <FileUp className="h-8 w-8 text-orange-500" />
              <span className="mt-2 text-sm font-black text-slate-900">Đính kèm bằng chứng</span>
              <span className="mt-1 text-xs font-semibold text-slate-500">Tối đa 5 file ảnh/PDF, backend sẽ lưu vào hồ sơ báo cáo.</span>
              <input type="file" multiple accept="image/*,.pdf,.txt" className="sr-only" onChange={handleFiles} />
              {files.length > 0 && (
                <span className="mt-3 text-xs font-extrabold text-orange-700">
                  Đã chọn {files.length} file
                </span>
              )}
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={confirmTruthful}
                onChange={(event) => setConfirmTruthful(event.target.checked)}
                className="mt-1 h-4 w-4 accent-orange-500"
              />
              <span className="text-sm font-semibold leading-6 text-slate-600">
                Tôi xác nhận nội dung báo cáo là trung thực và đồng ý để ShopVN xử lý theo quy trình kiểm duyệt.
              </span>
            </label>

            {error && (
              <p className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Lý do đã chọn: {selectedReason?.label || 'Chưa chọn'}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff315c] to-[#ff6b2c] px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
