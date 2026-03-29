import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  label: string;
  icon: ReactNode;
  value: string;
  displayValue?: string;
  editingValue: string;
  isEditing: boolean;
  isPending: boolean;
  placeholder?: string;
  description?: string;
  type?: string;
  sensitive?: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onValueChange: (value: string) => void;
}

export function EditableField({
  label,
  icon,
  value,
  displayValue,
  editingValue,
  isEditing,
  isPending,
  placeholder,
  description,
  type = 'text',
  sensitive = false,
  onStartEdit,
  onCancelEdit,
  onSave,
  onValueChange,
}: EditableFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold">
        {label}
        {sensitive && <span className="text-destructive ml-0.5">**</span>}
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div
            className={cn('absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground')}
          >
            {icon}
          </div>
          {isEditing ? (
            <Input
              type={type}
              value={editingValue}
              onChange={(e) => onValueChange(e.target.value)}
              className="pl-10"
              placeholder={placeholder}
            />
          ) : (
            <Input
              type={type}
              value={displayValue ?? value}
              className="pl-10"
              disabled
              placeholder={placeholder}
            />
          )}
        </div>
        {isEditing ? (
          <div className="flex gap-1 shrink-0">
            <Button type="button" variant="outline" size="icon" onClick={onSave} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onCancelEdit}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={onStartEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
