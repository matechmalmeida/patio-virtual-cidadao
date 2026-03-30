import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin } from 'lucide-react';
import { setGeofence } from '../services/seizure.service';
import { toast } from 'sonner';

export default function SeizureAddressPage() {
  const { seizureId } = useParams<{ seizureId: string }>();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada pelo navegador');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        toast.success('Localização capturada');
      },
      (err) => {
        setLoading(false);
        toast.error('Erro ao obter localização: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleConfirm = async () => {
    if (!seizureId || !coords) return;

    setLoading(true);
    try {
      await setGeofence(seizureId, {
        latitude: coords.lat,
        longitude: coords.lng,
        address: address || undefined,
        deadlineHours: 4, // default 4h, can be made dynamic
      });
      toast.success('Endereço de guarda confirmado');
      navigate(`/app/apreensao/${seizureId}/status`);
    } catch {
      toast.error('Erro ao confirmar endereço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold">Endereço de Guarda</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Informe o local onde o veículo ficará estacionado durante a custódia virtual.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Endereço (opcional)</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Rua das Flores, 123 - Centro"
          />
        </div>

        <div className="space-y-2">
          <Label>Localização GPS</Label>
          {coords ? (
            <div className="border rounded-lg p-4 bg-green-50 space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Localização capturada</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {coords.lat.toFixed(7)}, {coords.lng.toFixed(7)}
              </p>
              <p className="text-xs text-muted-foreground">
                Raio de monitoramento: 10 metros
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleGetLocation}
              disabled={loading}
              className="w-full"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {loading ? 'Obtendo localização...' : 'Capturar localização atual'}
            </Button>
          )}
        </div>

        {coords && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <p className="font-medium">Importante:</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
              <li>O veículo deve permanecer nesta localização</li>
              <li>A geocerca possui raio de 10 metros</li>
              <li>Sair da área configura violação da custódia</li>
            </ul>
          </div>
        )}
      </div>

      <Button
        onClick={handleConfirm}
        disabled={!coords || loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Confirmando...' : 'Confirmar Endereço de Guarda'}
      </Button>
    </div>
  );
}
