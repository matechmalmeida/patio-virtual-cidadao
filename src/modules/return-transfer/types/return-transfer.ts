export interface ReturnTransferStatus {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface ReturnTransferUser {
  id: string;
  name: string;
  email: string;
}

export interface ReturnTransferItem {
  id: string;
  requestId: string;
  entityType: 'gps' | 'seal';
  entityId: string;
  notes: string | null;
  parameters: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnTransferRequest {
  id: string;
  type: 'return';
  requestedById: string;
  requestedBy: ReturnTransferUser;
  assignedToId: string | null;
  assignedTo: ReturnTransferUser | null;
  statusId: string;
  status: ReturnTransferStatus;
  notes: string | null;
  cancellationReason: string | null;
  parameters: {
    seizureId?: string;
    vehiclePlate?: string;
    vehicleDescription?: string;
    scheduleLocationId?: string;
    locationName?: string;
    locationAddress?: string;
    scheduledDate?: string;
    scheduledTime?: string;
  } | null;
  items: ReturnTransferItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ReturnTransferListResponse {
  data: ReturnTransferRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateReturnTransferInput {
  notes?: string;
  parameters: {
    seizureId: string;
    vehiclePlate: string;
    vehicleDescription: string;
    scheduleLocationId: string;
    locationName: string;
    locationAddress: string;
    scheduledDate: string;
    scheduledTime: string;
  };
  items?: {
    entityType: 'gps' | 'seal';
    entityId: string;
    notes?: string;
  }[];
}
