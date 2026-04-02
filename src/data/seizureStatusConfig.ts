export type SeizureStatus =
  | 'aguardando-assinatura'
  | 'aguardando-equipamento'
  | 'em-deslocamento'
  | 'custodia-virtual'
  | 'custodia-violada'
  | 'aguardando-retirada'
  | 'finalizado'
  | 'cancelado';

export interface StatusConfig {
  className: string;
}

export const seizureStatusConfig: Record<SeizureStatus, StatusConfig> = {
  'aguardando-assinatura': {
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  'aguardando-equipamento': {
    className: 'bg-info/10 text-info border-info/30',
  },
  'em-deslocamento': {
    className: 'bg-info/10 text-info border-info/30',
  },
  'custodia-virtual': {
    className: 'bg-success/10 text-success border-success/30',
  },
  'custodia-violada': {
    className: 'bg-destructive/10 text-destructive border-destructive/30',
  },
  'aguardando-retirada': {
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  finalizado: {
    className: 'bg-success/10 text-success border-success/30',
  },
  cancelado: {
    className: 'bg-muted text-muted-foreground border-muted',
  },
};
