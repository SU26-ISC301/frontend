import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/64 backdrop-blur-md"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        className={cn(
          'premium-panel relative z-10 max-h-[90vh] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-[0_34px_90px_-44px_rgba(15,23,42,0.72)]',
          className
        )}
      >
        {title && (
          <div className="relative overflow-hidden px-6 py-5">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#0e2f28_48%,#db3417_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(113,248,228,0.22),transparent_20rem),radial-gradient(circle_at_88%_18%,rgba(255,218,211,0.22),transparent_18rem)]" />
            <div className="relative flex items-center justify-between">
              <h2 id="modal-title" className="text-lg font-black text-white">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="text-white/90 hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
        <div className={cn('max-h-[calc(90vh-5rem)] overflow-y-auto', !title && 'pt-6')}>
          {children}
        </div>
      </div>
    </div>
  );
}
