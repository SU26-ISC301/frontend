import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 1, label: 'Email' },
  { id: 2, label: 'Xác thực OTP' },
  { id: 3, label: 'Thông tin shop' },
];

export function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Tiến trình đăng ký" className="seller-register-steps mb-8 flex justify-center px-2">
      <div className="w-full max-w-lg">
        <div className="flex items-start justify-center">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const lineCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-start">
                <div className="flex w-[5.5rem] shrink-0 flex-col items-center gap-1.5 sm:w-28">
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-9 sm:w-9 sm:text-sm',
                    isCompleted && 'bg-brand-dark text-white',
                    isActive && 'bg-gradient-brand text-white shadow-glow ring-4 ring-brand-primary/25',
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
                      'hidden text-center text-[11px] font-medium leading-tight sm:block sm:text-xs',
                      isActive ? 'text-brand-primary' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className="mx-1 mt-4 h-0.5 w-10 shrink-0 sm:mx-2 sm:w-14"
                    aria-hidden
                  >
                    <div
                      className={cn(
                        'h-full w-full rounded-full transition-colors',
                        lineCompleted ? 'bg-gradient-brand' : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-center text-sm font-medium text-gray-700 sm:hidden">
          Bước {currentStep}: {STEPS[currentStep - 1]?.label}
        </p>
      </div>
    </nav>
  );
}
