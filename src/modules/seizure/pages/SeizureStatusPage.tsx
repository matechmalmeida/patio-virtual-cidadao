import { useParams, useNavigate } from 'react-router-dom';
import { useSeizureDetail, useGeofenceStatus } from '../hooks/useSeizure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/AlertBanner';
import { seizureStatusConfig, type SeizureStatus } from '@/data/seizureStatusConfig';
import { getApiErrorMessage } from '@/services/http/api-error';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Car,
  User,
  AlertTriangle,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  ListChecks,
} from 'lucide-react';
import type {
  SeizureDetailVehicle,
  SeizureDetailDriver,
  SeizureDetailAddress,
  SeizureDetailViolation,
} from '../types/seizure';

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b pb-2">
        <div className="p-1.5 rounded-md bg-muted">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <p className="text-sm">{value || '-'}</p>
    </div>
  );
}

function fmtPlate(plate: string) {
  const c = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return c.length === 7 ? `${c.slice(0, 3)}-${c.slice(3)}` : plate;
}

function fmtCpf(v?: string) {
  if (!v) return undefined;
  const d = v.replace(/\D/g, '');
  return d.length === 11 ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}` : v;
}

function fmtPhone(v?: string) {
  if (!v) return undefined;
  const d = v.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return v;
}

function fmtCep(v?: string) {
  if (!v) return undefined;
  const d = v.replace(/\D/g, '');
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : v;
}

function fmtDate(v?: string) {
  if (!v) return '-';
  return format(new Date(v), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR });
}

function fmtDateOnly(v?: string) {
  if (!v) return undefined;
  const d = v.split('T')[0];
  const p = d.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : v;
}

function fmtCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function VehicleSection({ vehicle }: { vehicle: SeizureDetailVehicle }) {
  return (
    <Section icon={Car} title="Veículo">
      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Placa" value={<span className="font-mono font-bold">{fmtPlate(vehicle.plate)}</span>} />
        <InfoItem label="Marca" value={vehicle.brand} />
        <InfoItem label="Modelo" value={vehicle.model} />
        <InfoItem label="Cor" value={vehicle.color} />
        <InfoItem label="Ano Fab." value={vehicle.year} />
        <InfoItem label="Ano Mod." value={vehicle.modelYear} />
        <InfoItem label="Chassi" value={vehicle.chassis} />
        <InfoItem label="RENAVAM" value={vehicle.renavam} />
        <InfoItem label="Tipo" value={vehicle.vehicleType} />
      </div>
    </Section>
  );
}

function DriverSection({ driver }: { driver?: SeizureDetailDriver }) {
  return (
    <Section icon={User} title="Condutor">
      {driver ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <InfoItem label="Nome" value={driver.name} />
            </div>
            <InfoItem label="CPF" value={fmtCpf(driver.cpf)} />
            <InfoItem label="Data de Nascimento" value={fmtDateOnly(driver.birthDate)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="RG" value={driver.rg} />
            <InfoItem label="Órgão Emissor" value={driver.rgIssuer} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="CNH" value={driver.cnh} />
            <InfoItem label="Categoria" value={driver.cnhCategory} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Validade CNH" value={fmtDateOnly(driver.cnhExpiration)} />
            <InfoItem label="Telefone" value={fmtPhone(driver.phone)} />
          </div>
          <InfoItem label="E-mail" value={driver.email} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Condutor não informado</p>
      )}
    </Section>
  );
}

function ViolationsSection({ violations }: { violations: SeizureDetailViolation[] }) {
  return (
    <Section icon={AlertTriangle} title="Enquadramento">
      {violations.length > 0 ? (
        <div className="space-y-2">
          {violations.map((v, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-sm">
                  {v.violationType.digit ? `${v.violationType.code}-${v.violationType.digit}` : v.violationType.code}
                </span>
                <Badge variant="outline" className="text-[10px]">{v.violationType.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{v.violationType.shortDescription}</p>
              {(v.violationType.score != null || v.violationType.amount != null) && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {v.violationType.score != null && <span>Pontos: {v.violationType.score}</span>}
                  {v.violationType.amount != null && <span>Valor: {fmtCurrency(v.violationType.amount / 100)}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Enquadramento não informado</p>
      )}
    </Section>
  );
}

function LocationSection({ address }: { address?: SeizureDetailAddress }) {
  if (!address) return null;

  const fullAddress = [
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    address.city,
    address.state,
    fmtCep(address.cep),
  ].filter(Boolean).join(', ');

  return (
    <Section icon={MapPin} title="Local da Ocorrência">
      <InfoItem label="Endereco" value={fullAddress || '-'} />
    </Section>
  );
}

const STATUS_STEPS = [
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

function TimelineSection({ currentSlug }: { currentSlug: string }) {
  return (
    <Section icon={ListChecks} title="Acompanhamento">
      <div className="space-y-0">
        {STATUS_STEPS.map((step, i) => {
          const state = getStepState(step.slug, currentSlug);

          return (
            <div key={step.slug} className="flex items-start gap-3 relative">
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute left-[11px] top-[24px] w-0.5 h-6 ${
                    state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}

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
    </Section>
  );
}

export default function SeizureStatusPage() {
  const { seizureId } = useParams<{ seizureId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useSeizureDetail(seizureId!);
  const { data: geofenceData } = useGeofenceStatus(seizureId!);

  const currentSlug = data?.status?.slug ?? geofenceData?.status ?? '';
  const statusCfg = seizureStatusConfig[currentSlug as SeizureStatus];

  const isViolated = currentSlug === 'custodia-violada';
  const isCancelled = currentSlug === 'cancelado';

  const deadlineAt = geofenceData?.geofence?.deadlineAt ? new Date(geofenceData.geofence.deadlineAt) : null;
  const now = new Date();
  const timeRemaining = deadlineAt ? deadlineAt.getTime() - now.getTime() : null;
  const hoursRemaining = timeRemaining ? Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60))) : null;
  const minutesRemaining = timeRemaining ? Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))) : null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 py-3 border-b bg-card flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate">Detalhes da Apreensão</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {isError && (
          <AlertBanner variant="error">
            {getApiErrorMessage(error, 'Não foi possível carregar os detalhes da apreensão.')}
          </AlertBanner>
        )}

        {data && (
          <>
            <div className="flex flex-col items-center gap-1.5 py-2">
              <span className="font-mono font-bold text-lg">{data.number}</span>
              <Badge variant="outline" className={statusCfg?.className}>
                {data.status.name}
              </Badge>
            </div>

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

            {currentSlug === 'em-deslocamento' && deadlineAt && timeRemaining && timeRemaining > 0 && (
              <div className={`border rounded-lg p-4 text-center ${timeRemaining < 30 * 60 * 1000 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                <p className="text-xs text-muted-foreground">Tempo restante para chegar ao destino</p>
                <p className={`text-3xl font-bold font-mono mt-1 ${timeRemaining < 30 * 60 * 1000 ? 'text-red-600' : 'text-blue-700'}`}>
                  {String(hoursRemaining).padStart(2, '0')}:{String(minutesRemaining).padStart(2, '0')}
                </p>
              </div>
            )}

            {geofenceData?.geofence && (currentSlug === 'custodia-virtual' || currentSlug === 'em-deslocamento') && (
              <div className="border rounded-lg p-4 space-y-2 bg-green-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Geocerca ativa</span>
                </div>
                {geofenceData.geofence.address && (
                  <p className="text-xs text-muted-foreground">{geofenceData.geofence.address}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Raio: {geofenceData.geofence.radiusMeters}m
                </p>
              </div>
            )}

            <TimelineSection currentSlug={currentSlug} />
            <VehicleSection vehicle={data.vehicle} />
            <DriverSection driver={data.driver} />
            <ViolationsSection violations={data.violations} />
            <LocationSection address={data.address} />

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <div className="p-1.5 rounded-md bg-muted">
                <Calendar className="h-4 w-4 text-foreground" />
              </div>
              Registrada em {fmtDate(data.createdAt)}
            </div>

            {currentSlug === 'custodia-virtual' && (
              <div className="pt-2 pb-4">
                <Button
                  onClick={() => navigate(`/app/translado-retorno/novo?seizureId=${seizureId}`)}
                  className="w-full h-12 font-semibold"
                >
                  <RotateCcw className="h-4 w-4" />
                  Solicitar retirada
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
