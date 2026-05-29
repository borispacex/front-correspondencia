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
    },
    PRIORITY: {
      BASE: '/correspondencia/priorities',
    },
    TYPE_DOCUMENT: {
      BASE: '/correspondencia/type-documents',
    },
    STATE_DOCUMENT: {
      BASE: '/correspondencia/state-documents',
    },
    DEPARTMENT: {
      BASE: '/correspondencia/departments',
    },
    PROVIDED: {
      BASE: '/correspondencia/provides',
    },
    UNIT: {
      BASE: '/correspondencia/units',
    },
    DOCUMENT: {
      BASE: '/correspondencia/documents',
    },
    ROUTER: {
      BASE: '/correspondencia/routers',
    },
  },
} as const;
