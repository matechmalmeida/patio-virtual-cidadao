import { executeMockRequest } from '@/services/http/mock-adapter';
import type {
  UserProfile,
  UserAddress,
  UserPreferences,
  UpdateProfilePayload,
  UpdateAddressPayload,
} from '../types/profile';

const AVATAR_KEY = 'pv-avatar';

let mockProfile: UserProfile = {
  id: 'usr_1',
  name: 'Joao Silva',
  email: 'cidadao@email.com',
  phone: '(11) 99999-8888',
  cpf: '123.456.789-00',
  avatarUrl: null,
  totpEnabled: false,
};

let mockAddress: UserAddress = {
  cep: '01001-000',
  street: 'Praca da Se',
  number: '100',
  complement: 'Apto 42',
  neighborhood: 'Se',
  city: 'Sao Paulo',
  state: 'SP',
};

let mockPreferences: UserPreferences = {
  language: 'pt',
  theme: 'light',
  pushNotifications: false,
};

export async function getProfile(): Promise<UserProfile> {
  return executeMockRequest(() => {
    const storedAvatar = localStorage.getItem(AVATAR_KEY);
    return { ...mockProfile, avatarUrl: storedAvatar };
  });
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  return executeMockRequest(() => {
    mockProfile = { ...mockProfile, ...payload };
    return { ...mockProfile };
  });
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  return executeMockRequest(() => {
    const url = URL.createObjectURL(file);
    localStorage.setItem(AVATAR_KEY, url);
    mockProfile = { ...mockProfile, avatarUrl: url };
    return { avatarUrl: url };
  });
}

export async function removeAvatar(): Promise<void> {
  return executeMockRequest(() => {
    localStorage.removeItem(AVATAR_KEY);
    mockProfile = { ...mockProfile, avatarUrl: null };
  });
}

export async function getAddress(): Promise<UserAddress> {
  return executeMockRequest(() => ({ ...mockAddress }));
}

export async function updateAddress(payload: UpdateAddressPayload): Promise<UserAddress> {
  return executeMockRequest(() => {
    mockAddress = { ...mockAddress, ...payload };
    return { ...mockAddress };
  });
}

export async function getPreferences(): Promise<UserPreferences> {
  return executeMockRequest(() => ({ ...mockPreferences }));
}

export async function updatePreferences(
  payload: Partial<UserPreferences>
): Promise<UserPreferences> {
  return executeMockRequest(() => {
    mockPreferences = { ...mockPreferences, ...payload };
    return { ...mockPreferences };
  });
}
