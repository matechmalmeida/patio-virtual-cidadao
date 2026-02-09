import type { VehicleLocation } from '@/types/case';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface LocationMapProps {
  location: VehicleLocation;
}

export function LocationMap({ location }: LocationMapProps) {
  const { t } = useTranslation();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  const embedUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <div>
          <p className="text-sm font-semibold">{location.label}</p>
          <p className="text-xs text-muted-foreground">{location.address}</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border h-40">
        <iframe
          title={t('dashboard.vehicleLocation')}
          src={embedUrl}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        />
      </div>

      <Button variant="outline" size="sm" className="w-full" asChild>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3.5 w-3.5" />
          {t('common.openInMaps')}
        </a>
      </Button>
    </div>
  );
}
