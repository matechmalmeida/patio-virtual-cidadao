import type { VehicleLocation } from '@/types/case';

export interface GPSDeviceData {
  deviceId: string;
  status: 'ativo' | 'inativo' | 'alerta';
  batteryLevel: number;
  signalStrength: 'forte' | 'moderado' | 'fraco';
  lastTransmission: string;
  firmwareVersion: string;
  installedAt: string;
  location: VehicleLocation;
  transmissionHistory: GPSTransmission[];
}

export interface GPSTransmission {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  speed: number;
  event: 'heartbeat' | 'ignition_on' | 'ignition_off' | 'movement' | 'tamper' | 'low_battery';
  eventLabel: string;
}

export function getMockGPSData(caseId: string): GPSDeviceData {
  if (caseId === '2') {
    return {
      deviceId: 'GPS-OBD2-00742',
      status: 'ativo',
      batteryLevel: 95,
      signalStrength: 'forte',
      lastTransmission: '2026-02-07T14:30:00',
      firmwareVersion: 'v3.2.1',
      installedAt: '2026-02-06T15:15:00',
      location: {
        type: 'residencia',
        label: 'Na sua residência',
        address: 'Rua das Flores, 234 — Aldeota, Fortaleza/CE',
        lat: -3.7327,
        lng: -38.5091,
      },
      transmissionHistory: [
        {
          id: 'tx1',
          timestamp: '2026-02-07T14:30:00',
          lat: -3.7327,
          lng: -38.5091,
          speed: 0,
          event: 'heartbeat',
          eventLabel: 'Transmissão periódica',
        },
        {
          id: 'tx2',
          timestamp: '2026-02-07T14:00:00',
          lat: -3.7327,
          lng: -38.5091,
          speed: 0,
          event: 'heartbeat',
          eventLabel: 'Transmissão periódica',
        },
        {
          id: 'tx3',
          timestamp: '2026-02-07T13:30:00',
          lat: -3.7327,
          lng: -38.5091,
          speed: 0,
          event: 'heartbeat',
          eventLabel: 'Transmissão periódica',
        },
        {
          id: 'tx4',
          timestamp: '2026-02-07T10:15:00',
          lat: -3.7327,
          lng: -38.5091,
          speed: 0,
          event: 'ignition_on',
          eventLabel: 'Ignição ligada',
        },
        {
          id: 'tx5',
          timestamp: '2026-02-07T10:16:00',
          lat: -3.7327,
          lng: -38.5091,
          speed: 0,
          event: 'ignition_off',
          eventLabel: 'Ignição desligada',
        },
        {
          id: 'tx6',
          timestamp: '2026-02-06T22:00:00',
          lat: -3.7327,
          lng: -38.5091,
          speed: 0,
          event: 'heartbeat',
          eventLabel: 'Transmissão periódica',
        },
      ],
    };
  }

  return {
    deviceId: 'GPS-OBD2-00698',
    status: 'ativo',
    batteryLevel: 78,
    signalStrength: 'moderado',
    lastTransmission: '2026-02-07T14:25:00',
    firmwareVersion: 'v3.2.1',
    installedAt: '2026-02-05T10:40:00',
    location: {
      type: 'residencia',
      label: 'Na sua residência',
      address: 'Rua das Flores, 234 — Aldeota, Fortaleza/CE',
      lat: -3.7327,
      lng: -38.5091,
    },
    transmissionHistory: [
      {
        id: 'tx10',
        timestamp: '2026-02-07T14:25:00',
        lat: -3.7327,
        lng: -38.5091,
        speed: 0,
        event: 'heartbeat',
        eventLabel: 'Transmissão periódica',
      },
      {
        id: 'tx11',
        timestamp: '2026-02-07T13:55:00',
        lat: -3.7327,
        lng: -38.5091,
        speed: 0,
        event: 'heartbeat',
        eventLabel: 'Transmissão periódica',
      },
      {
        id: 'tx12',
        timestamp: '2026-02-07T08:30:00',
        lat: -3.7327,
        lng: -38.5091,
        speed: 0,
        event: 'low_battery',
        eventLabel: 'Bateria baixa detectada',
      },
      {
        id: 'tx13',
        timestamp: '2026-02-06T20:00:00',
        lat: -3.7327,
        lng: -38.5091,
        speed: 0,
        event: 'heartbeat',
        eventLabel: 'Transmissão periódica',
      },
      {
        id: 'tx14',
        timestamp: '2026-02-06T14:12:00',
        lat: -3.7328,
        lng: -38.5093,
        speed: 5,
        event: 'movement',
        eventLabel: 'Movimentação detectada',
      },
      {
        id: 'tx15',
        timestamp: '2026-02-06T14:10:00',
        lat: -3.7327,
        lng: -38.5091,
        speed: 0,
        event: 'ignition_on',
        eventLabel: 'Ignição ligada',
      },
    ],
  };
}
