export const queryKeys = {
  brand: {
    all: ['brand'] as const,
    config: () => [...queryKeys.brand.all, 'config'] as const,
  },
  site: {
    all: ['site'] as const,
    content: (lang: string) => [...queryKeys.site.all, 'content', lang] as const,
  },
  schedule: {
    all: ['schedule'] as const,
    locations: () => [...queryKeys.schedule.all, 'locations'] as const,
    slots: () => [...queryKeys.schedule.all, 'slots'] as const,
  },
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
};
