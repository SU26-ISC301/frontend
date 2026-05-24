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
        className="absolute inset-0 bg-brand-darker/70 backdrop-blur-md"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-elevated',
          className
        )}
      >
        {title && (
          <div className="relative overflow-hidden px-6 py-5">
            <div className="absolute inset-0 bg-gradient-brand opacity-95" />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <h2 id="modal-title" className="text-lg font-bold text-white">
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
