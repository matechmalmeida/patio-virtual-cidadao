import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadAvatar, removeAvatar } from '../services/profile.service';

const MAX_SIZE = 5 * 1024 * 1024;

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

export function ProfileHeader({ name, email, avatarUrl, onAvatarChange }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast({ title: t('profile.avatarTooLarge'), variant: 'destructive' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: t('profile.avatarError'), variant: 'destructive' });
      return;
    }

    try {
      const { avatarUrl: url } = await uploadAvatar(file);
      onAvatarChange(url);
      toast({ title: t('profile.avatarUpdated') });
    } catch {
      toast({ title: t('profile.avatarError'), variant: 'destructive' });
    }

    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = async () => {
    try {
      await removeAvatar();
      onAvatarChange(null);
      toast({ title: t('profile.avatarRemoved') });
    } catch {
      toast({ title: t('profile.avatarError'), variant: 'destructive' });
    }
  };

  const initials = getInitials(name || '?');

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="relative">
        <Avatar className="h-20 w-20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <Button
          size="icon"
          variant="secondary"
          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>

        {avatarUrl && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-center">
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
