import { useParams, useNavigate } from 'react-router-dom';
import { useGeofenceStatus } from '../hooks/useSeizure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle2, Circle, AlertTriangle, Clock, MapPin } from 'lucide-react';

const STATUS_STEPS = [
  { slug: 'rascunho', label: 'Rascunho', icon: Circle },
  { slug: 'aguardando-assinatura', label: 'Aguardando Assinatura', icon: Clock },
  { slug: 'aguardando-equipamento', label: 'Aguardando Equipamento', icon: Clock },
  { slug: 'em-deslocamento', label: 'Em Deslocamento', icon: MapPin },
  { slug: 'custodia-virtual', label: 'Custódia Virtual', icon: CheckCircle2 },
  { slug: 'aguardando-retirada', label: 'Aguardando Retirada', icon: Clock },
  { slug: 'finalizado', label: 'Finalizado', icon: CheckCircle2 },
];

const STATUS_ORDER: Record<string, number> = {};
STATUS_STEPS.forEach((s, i) => { STATUS_ORDER[s.slug] = i; });

function getStepState(stepSlug: string, currentSlug: string): 'completed' | 'current' | 'pending' | 'violated' {
  if (currentSlug === 'custodia-violada' || currentSlug === 'cancelado') {
    const stepIdx = STATUS_ORDER[stepSlug] ?? -1;
    const violatedIdx = STATUS_ORDER['custodia-virtual'] ?? 4;
    if (stepIdx < violatedIdx) return 'completed';
    if (stepSlug === 'custodia-virtual') return 'violated';
    return 'pending';
  }

  const currentIdx = STATUS_ORDER[currentSlug] ?? -1;
  const stepIdx = STATUS_ORDER[stepSlug] ?? -1;

  if (stepIdx < currentIdx) return 'completed';
  if (stepIdx === currentIdx) return 'current';
  return 'pending';
}

export default function SeizureStatusPage() {
  const { seizureId } = useParams<{ seizureId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGeofenceStatus(seizureId!);

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const currentSlug = data.status;
  const isViolated = currentSlug === 'custodia-violada';
  const isCancelled = currentSlug === 'cancelado';
  const isFinished = currentSlug === 'finalizado';

  // Deadline countdown
  const deadlineAt = data.geofence?.deadlineAt ? new Date(data.geofence.deadlineAt) : null;
  const now = new Date();
  const timeRemaining = deadlineAt ? deadlineAt.getTime() - now.getTime() : null;
  const hoursRemaining = timeRemaining ? Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60))) : null;
  const minutesRemaining = timeRemaining ? Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))) : null;

  return (
    <div className="px-4 py-5 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold">Acompanhamento</h1>
        <p className="text-sm text-muted-foreground">Apreensão {seizureId?.slice(0, 8)}...</p>
      </div>

      {/* Violation banner */}
      {isViolated && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Custódia Violada</p>
            <p className="text-sm text-red-700 mt-1">
              O veículo saiu da área permitida ou o prazo expirou.
              Entre em contato com o órgão responsável imediatamente.
            </p>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-800">Apreensão Cancelada</p>
          <p className="text-sm text-gray-600 mt-1">Esta apreensão foi cancelada.</p>
        </div>
      )}

      {/* Deadline countdown */}
      {currentSlug === 'em-deslocamento' && deadlineAt && timeRemaining && timeRemaining > 0 && (
        <div className={`border rounded-lg p-4 text-center ${timeRemaining < 30 * 60 * 1000 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-xs text-muted-foreground">Tempo restante para chegar ao destino</p>
          <p className={`text-3xl font-bold font-mono mt-1 ${timeRemaining < 30 * 60 * 1000 ? 'text-red-600' : 'text-blue-700'}`}>
            {String(hoursRemaining).padStart(2, '0')}:{String(minutesRemaining).padStart(2, '0')}
          </p>
        </div>
      )}

      {/* Geofence info */}
      {data.geofence && (currentSlug === 'custodia-virtual' || currentSlug === 'em-deslocamento') && (
        <div className="border rounded-lg p-4 space-y-2 bg-green-50">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Geocerca ativa</span>
          </div>
          {data.geofence.address && (
            <p className="text-xs text-muted-foreground">{data.geofence.address}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Raio: {data.geofence.radiusMeters}m
          </p>
        </div>
      )}

      {/* Status timeline */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Status</h3>
        <div className="space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const state = getStepState(step.slug, currentSlug);
            const Icon = step.icon;

            return (
              <div key={step.slug} className="flex items-start gap-3 relative">
                {/* Connector line */}
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-[24px] w-0.5 h-6 ${
                      state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {state === 'completed' && (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  {state === 'current' && (
                    <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center animate-pulse">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                  {state === 'pending' && (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                  {state === 'violated' && (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  )}
                </div>

                {/* Label */}
                <div className="pb-6">
                  <p className={`text-sm ${
                    state === 'current' ? 'font-semibold text-primary' :
                    state === 'completed' ? 'text-green-700' :
                    state === 'violated' ? 'text-red-600 font-semibold' :
                    'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
