export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export interface SessionDevice {
  id: string;
  name: string;
  type: DeviceType;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  isTrusted?: boolean;
}

export interface UserPreferences {
  language: 'pt' | 'en' | 'es';
  theme: 'light' | 'dark';
  pushEnabled: boolean;
  pushTypes: {
    statusChange: boolean;
    docsAnalyzed: boolean;
    deadline: boolean;
    movementAlert: boolean;
  };
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
