import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigation,
  Home,
  FileWarning,
  Clock,
  CheckCircle2,
  CalendarDays,
  Flag,
  Check,
} from 'lucide-react';
import type { CaseStatus } from '@/types/case';
import { cn } from '@/lib/utils';

const STEPS: { status: CaseStatus; icon: typeof Navigation }[] = [
  { status: 'em_deslocamento', icon: Navigation },
  { status: 'custodia_domiciliar', icon: Home },
  { status: 'pendencias_regularizar', icon: FileWarning },
  { status: 'aguardando_validacao', icon: Clock },
  { status: 'apto_retirada', icon: CheckCircle2 },
  { status: 'aguardando_retirada', icon: CalendarDays },
  { status: 'finalizado', icon: Flag },
];

interface ProcessStepperProps {
  status: CaseStatus;
  className?: string;
}

export function ProcessStepper({ status, className }: ProcessStepperProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const currentIndex = STEPS.findIndex((s) => s.status === status);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [status]);

  return (
    <div className={cn('w-full', className)}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {t('dashboard.processProgress')}
      </p>
      <div
        ref={scrollRef}
        className="flex items-start gap-0 overflow-x-auto pb-2 scrollbar-hide"
      >
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;
          const Icon = step.icon;
          const isLast = i === STEPS.length - 1;

          return (
            <div
              key={step.status}
              ref={isCurrent ? activeRef : undefined}
              className="flex items-start flex-shrink-0"
            >
              <div className="flex flex-col items-center w-16 lg:w-20">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    isCompleted && 'bg-emerald-500 text-white',
                    isCurrent && 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2',
                    isFuture && 'bg-muted text-muted-foreground',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1.5 text-center leading-tight',
                    isCompleted && 'text-emerald-600 font-medium',
                    isCurrent && 'text-primary font-semibold',
                    isFuture && 'text-muted-foreground',
                  )}
                >
                  {t(`dashboard.step_${step.status}`)}
                </span>
              </div>
              {!isLast && (
                <div className="flex items-center mt-4 -mx-1">
                  <div
                    className={cn(
                      'h-0.5 w-4 lg:w-6',
                      i < currentIndex ? 'bg-emerald-500' : 'bg-muted',
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
