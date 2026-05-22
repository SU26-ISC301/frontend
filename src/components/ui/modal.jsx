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
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className={cn(!title && 'pt-6')}>{children}</div>
      </div>
    </div>
  );
}
