export interface SeizureTermResponse {
  seizureId: string;
  seizureStatus: string;
  term: {
    id: string;
    slug: string;
    title: string;
    content: string;
    version: number;
  };
  signed: boolean;
  signedAt: string | null;
  signedBy: { id: string; name: string } | null;
  refused: boolean;
  refusedAt: string | null;
  refusalReason: string | null;
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
