import type { ScheduleLocation, ScheduleSlot } from '@/types/case';

export const mockLocations: ScheduleLocation[] = [
  {
    id: 'loc1',
    name: 'Posto Aldeota',
    address: 'Rua Tibúrcio Cavalcante, 1200 — Aldeota',
    lat: -3.7327,
    lng: -38.5091,
  },
  {
    id: 'loc2',
    name: 'Posto Messejana',
    address: 'Av. Washington Soares, 5400 — Messejana',
    lat: -3.8127,
    lng: -38.4891,
  },
  {
    id: 'loc3',
    name: 'Posto Centro',
    address: 'Rua General Sampaio, 45 — Centro',
    lat: -3.7227,
    lng: -38.5291,
  },
];

export const mockSlots: ScheduleSlot[] = [
  { id: 's1', date: '2026-02-12', time: '08:00', available: true, recommended: true },
  { id: 's2', date: '2026-02-12', time: '09:00', available: true },
  { id: 's3', date: '2026-02-12', time: '10:00', available: false },
  { id: 's4', date: '2026-02-12', time: '11:00', available: true },
  { id: 's5', date: '2026-02-12', time: '14:00', available: true, recommended: true },
  { id: 's6', date: '2026-02-12', time: '15:00', available: true },
  { id: 's7', date: '2026-02-13', time: '08:00', available: true },
  { id: 's8', date: '2026-02-13', time: '09:00', available: false },
  { id: 's9', date: '2026-02-13', time: '10:00', available: true, recommended: true },
  { id: 's10', date: '2026-02-13', time: '14:00', available: true },
  { id: 's11', date: '2026-02-14', time: '08:00', available: true },
  { id: 's12', date: '2026-02-14', time: '09:00', available: true },
];
