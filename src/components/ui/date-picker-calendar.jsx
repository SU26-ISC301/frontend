import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const MONTH_LABELS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      outside: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      outside: false,
    });
  }

  let nextMonthDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      date: new Date(year, month + 1, nextMonthDay),
      outside: true,
    });
    nextMonthDay += 1;
  }

  return cells;
}

export function DatePickerCalendar({
  open,
  anchorRef,
  value,
  onSelect,
  onClose,
  minDate,
  maxDate,
}) {
  const selected = parseISODate(value);
  const today = startOfDay(new Date());

  const [view, setView] = useState(() => selected || today);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 300 });

  useEffect(() => {
    const parsed = parseISODate(value);
    if (parsed) setView(parsed);
  }, [value]);

  useEffect(() => {
    if (!open || !anchorRef.current) return undefined;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const calendarHeight = 360;
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openAbove = spaceBelow < calendarHeight && rect.top > calendarHeight;

      setPosition({
        top: openAbove ? rect.top - calendarHeight - gap : rect.bottom + gap,
        left: Math.min(
          Math.max(8, rect.left),
          window.innerWidth - Math.max(rect.width, 300) - 8
        ),
        width: Math.max(rect.width, 300),
        openAbove,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const cells = useMemo(
    () => buildCalendarDays(view.getFullYear(), view.getMonth()),
    [view]
  );

  const isDisabled = (date) => {
    const day = startOfDay(date);
    if (minDate && day < startOfDay(minDate)) return true;
    if (maxDate && day > startOfDay(maxDate)) return true;
    return false;
  };

  const goMonth = (delta) => {
    setView((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  if (!open) return null;

  const calendar = (
    <>
      <div
        data-date-picker-calendar
        className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px]"
        aria-hidden
        onClick={onClose}
      />
      <div
      data-date-picker-calendar
      className="fixed z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Chọn ngày"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-elevated ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-shopee-light via-white to-shopee-light/50 px-4 py-3">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-brand-muted transition-colors hover:bg-white hover:text-brand-primary hover:shadow-sm"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">
              {MONTH_LABELS[view.getMonth()]}
            </p>
            <p className="text-xs font-bold text-brand-primary">{view.getFullYear()}</p>
          </div>
          <button
            type="button"
            onClick={() => goMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-brand-muted transition-colors hover:bg-white hover:text-brand-primary hover:shadow-sm"
            aria-label="Tháng sau"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 px-3 pt-3">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 p-3 pt-1">
          {cells.map(({ date, outside }, index) => {
            const disabled = isDisabled(date);
            const isSelected = selected && isSameDay(date, selected);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={`${date.toISOString()}-${index}`}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  onSelect(toISODate(date));
                  onClose();
                }}
                className={cn(
                  'relative flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-all',
                  outside && 'text-gray-300',
                  !outside && !disabled && 'text-brand-dark hover:bg-shopee-light hover:text-brand-primary',
                  disabled && 'cursor-not-allowed text-gray-300 opacity-40',
                  isToday && !isSelected && 'ring-2 ring-brand-primary/30 ring-inset',
                  isSelected &&
                    'bg-gradient-brand text-white shadow-glow hover:brightness-110 hover:text-white'
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-3 py-2.5">
          <button
            type="button"
            className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            type="button"
            className="rounded-xl bg-gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-40"
            disabled={isDisabled(today)}
            onClick={() => {
              onSelect(toISODate(today));
              onClose();
            }}
          >
            Hôm nay
          </button>
        </div>
      </div>
    </div>
    </>
  );

  return createPortal(calendar, document.body);
}
