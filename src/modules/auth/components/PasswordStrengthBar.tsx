import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PasswordStrengthBarProps {
  password: string;
}

function computeScore(password: string): number {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9\s]/.test(password)) score += 1;

  return Math.min(score, 5);
}

const LEVELS = [
  { key: 'veryWeak', color: 'bg-red-500' },
  { key: 'weak', color: 'bg-orange-500' },
  { key: 'fair', color: 'bg-yellow-500' },
  { key: 'strong', color: 'bg-emerald-500' },
  { key: 'veryStrong', color: 'bg-green-600' },
] as const;

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { t } = useTranslation();

  const score = useMemo(() => computeScore(password), [password]);

  if (!password) return null;

  const levelIndex = Math.max(0, score - 1);
  const level = LEVELS[levelIndex];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {LEVELS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i <= levelIndex ? level.color : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p className={cn('text-xs', level.color.replace('bg-', 'text-'))}>
        {t(`auth.resetPassword.strength.${level.key}`)}
      </p>
    </div>
  );
}
