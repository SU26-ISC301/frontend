import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  DatePickerCalendar,
  parseISODate,
} from './date-picker-calendar';

function formatDisplay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export const DateInput = forwardRef(function DateInput(
  {
    className,
    label,
    error,
    id,
    name,
    value = '',
    onChange,
    onBlur,
    disabled,
    min,
    max,
    placeholder = 'dd/mm/yyyy',
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const wrapperRef = useRef(null);
  const hiddenRef = useRef(null);
  const [open, setOpen] = useState(false);

  const setRefs = (node) => {
    hiddenRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const minDate = min ? parseISODate(min) : undefined;
  const maxDate = max ? parseISODate(max) : undefined;

  // Ngày sinh: mặc định không chọn tương lai
  const effectiveMaxDate =
    maxDate || (!max && !min ? new Date() : undefined);

  const emitChange = (iso) => {
    onChange?.({
      target: { name, value: iso, id: inputId },
    });
  };

  const openCalendar = () => {
    if (disabled) return;
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (e) => {
      const target = e.target;
      if (wrapperRef.current?.contains(target)) return;
      if (target.closest?.('[data-date-picker-calendar]')) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div className="w-full space-y-1.5" ref={wrapperRef}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input ref={setRefs} type="hidden" id={inputId} name={name} value={value} />

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={openCalendar}
          className={cn(
            'flex h-10 w-full items-center rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-11 text-left text-sm transition-colors',
            'focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/15',
            'disabled:cursor-not-allowed disabled:bg-gray-100',
            !value && 'text-gray-400',
            value && 'text-gray-900',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          onBlur={onBlur}
        >
          {value ? formatDisplay(value) : placeholder}
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Mở lịch chọn ngày"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className={cn(
            'absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-all',
            'text-brand-primary hover:bg-shopee-light focus:outline-none focus:ring-2 focus:ring-brand-primary/30',
            open && 'bg-gradient-brand text-white shadow-glow hover:brightness-110 hover:text-white',
            disabled && 'opacity-50'
          )}
        >
          <CalendarDays className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
        </button>

        <DatePickerCalendar
          open={open}
          anchorRef={wrapperRef}
          value={value}
          minDate={minDate}
          maxDate={effectiveMaxDate}
          onSelect={emitChange}
          onClose={() => setOpen(false)}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
