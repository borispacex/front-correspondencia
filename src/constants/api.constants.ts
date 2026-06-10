export const BASE_URL = import.meta.env.VITE_API_PREFIX as string;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/token',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  // Social Auth
  SOCIAL_AUTH: {
    MICROSOFT: '/auth/social/microsoft',
  },
  // Roles
  ROLES: {
    BASE: '/admin/roles',
    BY_ID: (id: number) => `/admin/roles/${id}`,
  },
  // Permissions
  PERMISSIONS: {
    BASE: '/admin/permissions',
    BY_ID: (id: number) => `/admin/permissions/${id}`,
  },
  // Menu Items
  MENU_ITEMS: {
    BASE: '/admin/menu-items',
    BY_ID: (id: number) => `/admin/menu-items/${id}`,
  },
  // Users
  USERS: {
    BASE: '/admin/users',
    BY_ID: (id: number) => `/admin/users/${id}`,
  },
  // Dashboard
  DASHBOARD: {
    ADMIN: '/admin/dashboard',
    CORRESP: '/correspondencia/dashboard',
  },
  // Profile
  PROFILE: {
    BASE: '/profile/users',
    CHANGE_PASSWORD: `/profile/users/password`,
    PHONE: `/profile/users/phone`,
    PHOTO: `/profile/users/photo`,
  },
  // SAGA
  SAGA: {
    USUARIOS: {
      BASE: '/saga/usuarios',
      SEARCH: '/saga/usuarios/search',
    },
  },
  // CORRESPONDENCIA
  CORRESPONDENCE: {
    PROCEDURE: {
      BASE: '/correspondencia/procedures',
      BY_ID: (id: number) => `/correspondencia/procedures/${id}`,
    },
    PRIORITY: {
      BASE: '/correspondencia/priorities',
      BY_ID: (id: number) => `/correspondencia/priorities/${id}`,
    },
    TYPE_DOCUMENT: {
      BASE: '/correspondencia/type-documents',
      BY_ID: (id: number) => `/correspondencia/type-documents/${id}`,
    },
    STATE_DOCUMENT: {
      BASE: '/correspondencia/state-documents',
      BY_ID: (id: number) => `/correspondencia/state-documents/${id}`,
    },
    DEPARTMENT: {
      BASE: '/correspondencia/departments',
      BY_ID: (id: number) => `/correspondencia/departments/${id}`,
    },
    PROVIDED: {
      BASE: '/correspondencia/provides',
      BY_ID: (id: number) => `/correspondencia/provides/${id}`,
    },
    UNIT: {
      BASE: '/correspondencia/units',
      BY_ID: (id: number) => `/correspondencia/units/${id}`,
    },
    DOCUMENT: {
      BASE: '/correspondencia/documents',
      BY_ID: (id: number) => `/correspondencia/documents/${id}`,
    },
    ROUTER: {
      BASE: '/correspondencia/routers',
      BY_ID: (id: number) => `/correspondencia/routers/${id}`,
    },
  },
} as const;
