import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 1, label: 'Số điện thoại' },
  { id: 2, label: 'Thông tin đăng ký' },
  { id: 3, label: 'Xác thực OTP' },
];

export function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Tiến trình đăng ký" className="mb-8">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <li
              key={step.id}
              className={cn(
                'flex flex-1 items-center',
                index < STEPS.length - 1 && 'after:mx-2 after:h-0.5 after:flex-1 after:bg-gray-200 sm:after:mx-4',
                isCompleted && 'after:bg-slate-600'
              )}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-9 sm:w-9 sm:text-sm',
                    isCompleted && 'bg-slate-800 text-white',
                    isActive && 'bg-shopee text-white ring-4 ring-shopee/20',
                    !isCompleted && !isActive && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </span>
                <span
                  className={cn(
                    'hidden text-center text-xs font-medium sm:block',
                    isActive ? 'text-shopee' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-sm font-medium text-gray-700 sm:hidden">
        Bước {currentStep}: {STEPS[currentStep - 1]?.label}
      </p>
    </nav>
  );
}
