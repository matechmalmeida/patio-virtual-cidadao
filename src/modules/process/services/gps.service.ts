export interface GPSDeviceData {
  deviceId: string;
  plate: string;
  latitude: number;
  longitude: number;
  speed: number;
  ignition: string;
  lastUpdate: string;
  status: string;
}

export async function getGpsStatusByCase(_caseId: string): Promise<GPSDeviceData> {
  throw new Error('GPS data not available');
}
