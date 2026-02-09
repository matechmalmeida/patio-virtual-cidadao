import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import {
  MapPin,
  Calendar,
  Clock,
  CalendarPlus,
  Navigation,
  QrCode,
  FileText,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SchedulingConfirmationPage() {
  const { currentCase } = useAuth();
  const navigate = useNavigate();

  if (!currentCase?.appointment) {
    return (
      <div className="px-4 py-5">
        <AlertBanner variant="error">Nenhum agendamento encontrado.</AlertBanner>
      </div>
    );
  }

  const { appointment } = currentCase;

  const googleMapsUrl = appointment.location.lat && appointment.location.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${appointment.location.lat},${appointment.location.lng}`
    : '#';

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Success header */}
      <div className="text-center py-4">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-xl font-bold">Agendamento confirmado!</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compareça no dia e horário marcados.
        </p>
      </div>

      {/* QR Code */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 pb-6 flex flex-col items-center">
          <div className="h-40 w-40 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-primary/20 mb-4">
            <QrCode className="h-20 w-20 text-primary/40" />
          </div>
          <p className="text-xs text-muted-foreground">Código do agendamento</p>
          <p className="text-lg font-bold tracking-wider mt-0.5">{appointment.code}</p>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Local</p>
              <p className="text-sm font-semibold">{appointment.location.name}</p>
              <p className="text-xs text-muted-foreground">{appointment.location.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Data</p>
              <p className="text-sm font-semibold">{appointment.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Horário</p>
              <p className="text-sm font-semibold">{appointment.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required documents */}
      <AlertBanner variant="info" title="Leve no dia:">
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Documento de identidade (RG ou CNH)</li>
          <li>Comprovante do agendamento (esta tela ou o código)</li>
        </ul>
      </AlertBanner>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full h-11" asChild>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-4 w-4" />
            Ver rota no Google Maps
          </a>
        </Button>

        <Button variant="outline" className="w-full h-11">
          <CalendarPlus className="h-4 w-4" />
          Adicionar ao calendário
        </Button>

        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full h-11 font-semibold"
        >
          <Home className="h-4 w-4" />
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}
