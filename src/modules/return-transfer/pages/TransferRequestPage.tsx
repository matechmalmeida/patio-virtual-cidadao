import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequestTransfer } from '../hooks/useReturnTransfer';
import { AlertBanner } from '@/components/AlertBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function TransferRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seizureId = searchParams.get('seizureId') ?? '';

  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const transferMutation = useRequestTransfer();

  const canSubmit =
    !!seizureId &&
    !!departureDate &&
    !!departureTime &&
    !!destinationAddress.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');

    const departureAt = `${departureDate}T${departureTime}:00`;

    try {
      await transferMutation.mutateAsync({
        seizureId,
        data: {
          departureAt,
          destinationAddress: destinationAddress.trim(),
          destinationLat: 0,
          destinationLng: 0,
          notes: notes.trim() || undefined,
        },
      });
      navigate(`/app/apreensao/${seizureId}/status`, { replace: true });
    } catch {
      setError('Erro ao solicitar translado. Tente novamente.');
    }
  };

  if (!seizureId) {
    return (
      <div className="px-4 py-5">
        <AlertBanner variant="error">Apreensao nao informada.</AlertBanner>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold">Solicitar Translado</h1>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="departureDate">Data de partida</Label>
          <Input
            id="departureDate"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departureTime">Hora de partida</Label>
          <Input
            id="departureTime"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destinationAddress">Endereco de destino</Label>
          <Input
            id="destinationAddress"
            type="text"
            placeholder="Informe o endereco completo de destino"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observacoes (opcional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informacoes adicionais sobre o translado"
            maxLength={500}
            rows={3}
          />
          <p className="text-xs text-muted-foreground text-right">{notes.length}/500</p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || transferMutation.isPending}
          className="w-full h-12 font-semibold"
        >
          <CheckCircle2 className="h-4 w-4" />
          {transferMutation.isPending ? 'Enviando...' : 'Confirmar solicitacao'}
        </Button>
      </div>
    </div>
  );
}
