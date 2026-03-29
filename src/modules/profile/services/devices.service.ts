import { httpGet, httpPatch, httpDelete, httpPut } from '@/services/http/http-client';
import type { Device, DeviceListResponse, CurrentDeviceResponse } from '../types/device';

const BASE_URL = '/v1/devices';

export const devicesService = {
  async list(): Promise<DeviceListResponse> {
    return httpGet<DeviceListResponse>(`${BASE_URL}?limit=50&sortBy=lastSeenAt&sortOrder=desc`);
  },

  async getCurrent(): Promise<CurrentDeviceResponse> {
    return httpGet<CurrentDeviceResponse>(`${BASE_URL}/current`);
  },

  async rename(id: string, name: string): Promise<Device> {
    return httpPatch<Device>(`${BASE_URL}/${id}`, { name });
  },

  async trust(id: string, reauthToken: string): Promise<Device> {
    return httpPut<Device>(`${BASE_URL}/${id}/trust`, undefined, {
      headers: { 'X-Reauth-Token': reauthToken },
    });
  },

  async untrust(id: string, reauthToken: string): Promise<Device> {
    return httpDelete<Device>(`${BASE_URL}/${id}/trust`, {
      headers: { 'X-Reauth-Token': reauthToken },
    });
  },

  async revoke(id: string): Promise<void> {
    return httpDelete(`${BASE_URL}/${id}`);
  },

  async revokeAll(): Promise<{ revokedCount: number }> {
    return httpDelete<{ revokedCount: number }>(BASE_URL);
  },
};
