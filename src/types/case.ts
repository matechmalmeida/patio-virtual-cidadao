export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'critical';
  read: boolean;
  timestamp: string;
  actionLink?: string;
  actionLabel?: string;
}

export type CaseStatus =
  | 'em_deslocamento'
  | 'custodia_domiciliar'
  | 'pendencias_regularizar'
  | 'aguardando_validacao'
  | 'apto_retirada'
  | 'aguardando_retirada'
  | 'finalizado';

export type PendencyStatus = 'pendente' | 'enviado' | 'em_analise' | 'aprovado' | 'reprovado';

export type TimelineEventType = 'info' | 'success' | 'warning' | 'error';

export type TermType = 'custodia_domiciliar' | 'retirada_dispositivo' | 'regularizacao';

export type TermStatus = 'pendente' | 'assinado';

export interface Term {
  id: string;
  type: TermType;
  title: string;
  description: string;
  content: string;
  status: TermStatus;
  signedAt?: string;
}

export interface SeizureReason {
  code: string;
  description: string;
  legalBasis: string;
}

export interface VehicleLocation {
  type: 'patio' | 'residencia' | 'em_transito';
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Pendency {
  id: string;
  name: string;
  description: string;
  value?: number;
  status: PendencyStatus;
  uploadedFile?: string;
  rejectionReason?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: TimelineEventType;
  completed: boolean;
  link?: string;
  linkLabel?: string;
}


export interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  recommended?: boolean;
}

export interface ScheduleLocation {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Appointment {
  id: string;
  code: string;
  location: ScheduleLocation;
  date: string;
  time: string;
}

export interface CaseData {
  id: string;
  code: string;
  plate: string;
  vehicle: string;
  vehicleColor: string;
  status: CaseStatus;
  createdAt: string;
  seizureReason: SeizureReason;
  seizureLocation: string;
  vehicleLocation: VehicleLocation;
  address: string;
  timeRemainingMinutes?: number;
  pendencies: Pendency[];
  timeline: TimelineEvent[];
  notifications: Notification[];
  terms: Term[];
  appointment?: Appointment;
}

export interface HistoricalCase {
  id: string;
  code: string;
  plate: string;
  vehicle: string;
  status: 'finalizado';
  createdAt: string;
  finishedAt: string;
  seizureReason: string;
}

export interface SupportTicket {
  id: string;
  category: string;
  description: string;
  protocol: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
