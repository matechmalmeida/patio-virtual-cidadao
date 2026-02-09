import { ChevronRight, type LucideIcon } from 'lucide-react';

interface ProfileMenuCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export function ProfileMenuCard({
  icon: Icon,
  label,
  description,
  onClick,
  variant = 'default',
}: ProfileMenuCardProps) {
  const isDestructive = variant === 'destructive';

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors w-full text-left"
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`h-5 w-5 ${isDestructive ? 'text-destructive' : 'text-primary'}`}
        />
        <div>
          <p className={`text-sm font-semibold ${isDestructive ? 'text-destructive' : ''}`}>
            {label}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {!isDestructive && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}
