export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  avatarUrl: string | null;
  totpEnabled: boolean;
}

export interface UserAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface UserPreferences {
  language: 'pt' | 'en' | 'es';
  theme: 'light' | 'dark';
  pushNotifications: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  cpf: string;
}

export interface UpdateAddressPayload {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}
