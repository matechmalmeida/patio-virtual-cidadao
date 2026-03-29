export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export interface Device {
  id: string;
  userId: string;
  name: string;
  type: DeviceType;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  isTrusted: boolean;
  lastSeenAt: string;
  lastIp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListResponse {
  data: Device[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CurrentDeviceResponse {
  device: Device;
  isCurrent: boolean;
}
