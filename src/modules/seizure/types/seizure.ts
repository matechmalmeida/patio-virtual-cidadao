export interface SeizureTermItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  version: number;
  signed: boolean;
  signedAt: string | null;
  signedBy: { id: string; name: string } | null;
  refused: boolean;
  refusedAt: string | null;
  refusalReason: string | null;
}

export interface SeizureTermsResponse {
  seizureId: string;
  seizureStatus: string;
  terms: SeizureTermItem[];
  allSigned: boolean;
}

export interface GeofenceStatus {
  seizureId: string;
  status: string;
  geofence: {
    id: string;
    centerLatitude: number;
    centerLongitude: number;
    radiusMeters: number;
    address: string | null;
    deadlineAt: string;
    violatedAt: string | null;
    lastCheckAt: string | null;
  } | null;
}

export interface SeizureListItem {
  id: string;
  number: string;
  towType: string;
  notes?: string;
  status: { id: string; slug: string; name: string };
  vehicle: { plate: string; brand?: string; model?: string; color?: string };
  driver?: { cpf: string; name?: string };
  address?: { street?: string; neighborhood?: string; city?: string; state?: string };
  violations?: { violationType: { code: string; shortDescription: string; category: string } }[];
  createdAt: string;
}

export interface SeizureDetailVehicle {
  plate: string;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  modelYear?: number;
  chassis?: string;
  renavam?: string;
  vehicleType?: string;
}

export interface SeizureDetailDriver {
  cpf: string;
  name?: string;
  birthDate?: string;
  rg?: string;
  rgIssuer?: string;
  cnh?: string;
  cnhCategory?: string;
  cnhExpiration?: string;
  phone?: string;
  email?: string;
}

export interface SeizureDetailAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
}

export interface SeizureDetailViolation {
  violationType: {
    code: string;
    digit?: string;
    shortDescription: string;
    description?: string;
    category: string;
    score?: number;
    amount?: number;
  };
}

export interface SeizureDetailGeofence {
  id: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  address?: string;
  deadlineAt: string;
  violatedAt?: string;
  lastCheckAt?: string;
}

export interface SeizureDetailResponse {
  id: string;
  number: string;
  towType: string;
  notes?: string;
  cancellationReason?: string;
  deadline?: string;
  status: { id: string; slug: string; name: string };
  vehicle: SeizureDetailVehicle;
  driver?: SeizureDetailDriver;
  address?: SeizureDetailAddress;
  violations: SeizureDetailViolation[];
  geofence?: SeizureDetailGeofence;
  statusHistory?: string[];
  createdAt: string;
}

export interface SeizureListResponse {
  data: SeizureListItem[];
  meta: { total: number; page: number; totalPages: number };
}

export interface GeofenceCheckResult {
  seizureId: string;
  inside: boolean;
  distance: number;
  radiusMeters: number;
  status: string;
  message: string;
}
