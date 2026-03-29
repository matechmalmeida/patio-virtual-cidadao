import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AvatarCropperDialog } from '@/modules/auth/components/AvatarCropperDialog';
import { getHttpClient } from '@/services/http/http-client';

const MAX_SIZE = 5 * 1024 * 1024;

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function resolveAvatarUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) {
    try {
      const baseUrl = getHttpClient()?.baseUrl ?? '';
      const origin = new URL(baseUrl).origin;
      return `${origin}${url}`;
    } catch {
      return url;
    }
  }
  return url;
}

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isUploading?: boolean;
}

export function ProfileHeader({
  name,
  email,
  avatarUrl,
  onUpload,
  onDelete,
  isUploading = false,
}: ProfileHeaderProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast({ title: t('profile.avatarTooLarge'), variant: 'destructive' });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ title: t('profile.avatarError'), variant: 'destructive' });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCropperOpen(true);

    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], 'avatar.png', { type: 'image/png' });
    onUpload(file);
    setCropperOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleCropperClose = (open: boolean) => {
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCropperOpen(open);
  };

  const initials = getInitials(name || '?');
  const resolvedUrl = resolveAvatarUrl(avatarUrl);

  return (
    <>
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            {resolvedUrl && <AvatarImage src={resolvedUrl} alt={name} />}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>

          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>

          {avatarUrl && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md"
              onClick={onDelete}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="text-center">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      {previewUrl && (
        <AvatarCropperDialog
          open={cropperOpen}
          onOpenChange={handleCropperClose}
          imageSrc={previewUrl}
          onCropComplete={handleCropComplete}
          isUploading={isUploading}
        />
      )}
    </>
  );
}
