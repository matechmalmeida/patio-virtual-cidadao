import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Car,
  Satellite,
  FileCheck,
  CalendarCheck,
  ArrowRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEP_ICONS = [Car, Satellite, FileCheck, CalendarCheck] as const;

const STEP_COLORS = [
  'bg-primary/10 text-primary',
  'bg-warning/10 text-warning',
  'bg-success/10 text-success',
  'bg-info/10 text-info',
] as const;

export function OnboardingTutorial({ isOpen, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
  const totalSteps = 4;

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const Icon = STEP_ICONS[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={onComplete}
      />

      <div className="relative z-10 w-full max-w-md mx-4 mb-0 sm:mb-0 bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          aria-label={t('common.cancel')}
        >
          <X className="h-4 w-4" />
        </button>

        <Progress value={progress} className="h-1 rounded-none" />

        <div className="px-6 pt-8 pb-6 text-center">
          <div
            className={cn(
              'h-20 w-20 rounded-2xl mx-auto flex items-center justify-center mb-6 transition-all duration-500',
              STEP_COLORS[currentStep]
            )}
          >
            <Icon className="h-10 w-10" />
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-2">
            {t(`onboarding.steps.${currentStep}.title`)}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {t(`onboarding.steps.${currentStep}.description`)}
          </p>
        </div>

        <div className="flex justify-center gap-2 pb-5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === currentStep
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-12"
            >
              {t('common.back')}
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={onComplete}
              className="flex-1 h-12 text-muted-foreground"
            >
              {t('onboarding.skip')}
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 h-12 font-semibold">
            {currentStep < totalSteps - 1 ? (
              <>
                {t('onboarding.next')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              t('onboarding.start')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
