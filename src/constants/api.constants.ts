export const BASE_URL = import.meta.env.VITE_API_PREFIX as string;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/token",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  // Roles
  ROLES: {
    BASE: "/admin/roles",
    BY_ID: (id: number) => `/admin/roles/${id}`,
  },
  // Permissions
  PERMISSIONS: {
    BASE: "/admin/permissions",
    BY_ID: (id: number) => `/admin/permissions/${id}`,
  },
  // Menu Items
  MENU_ITEMS: {
    BASE: "/admin/menu-items",
    BY_ID: (id: number) => `/admin/menu-items/${id}`,
  },
  // Users
  USERS: {
    BASE: "/admin/users",
    BY_ID: (id: number) => `/admin/users/${id}`,
  },
  // Profile
  PROFILE: {
    BASE: "/profile/users",
    CHANGE_PASSWORD: `/profile/users/password`,
    PHONE: `/profile/users/phone`,
    PHOTO: `/profile/users/photo`,
  },
  // SAGA
  SAGA: {
    ALUMNOS: {
      BASE: "/saga/alumnos",
      BY_ID: (id: number) => `/saga/alumnos/${id}`,
    },
    CURSOS: {
      BASE: "/saga/cursos",
      BY_ID: (id: number) => `/saga/cursos/${id}`,
    },
    ESPECIALIDADES: {
      BASE: "/saga/especialidades",
      BY_ID: (id: number) => `/saga/especialidades/${id}`,
    },
    PERIODOS_ACADEMICOS: {
      BASE: "/saga/periodos-academicos",
      BY_ID: (id: number) => `/saga/periodos-academicos/${id}`,
    },
    NIVEL_ACADEMICO: {
      BASE: "/saga/nivel-academico",
      BY_ID: (id: number) => `/saga/nivel-academico/${id}`,
    },
    PERIODO_GESTION: {
      BASE: "/saga/periodos-gestion",
      BY_ID: (id: number) => `/saga/periodos-gestion/${id}`,
    },
    UNIDAD_ACADEMICA: {
      BASE: "/saga/unidades-academicas",
      BY_ID: (id: number) => `/saga/unidades-academicas/${id}`,
    },
    TIPO: {
      BASE: "/saga/tipos",
    },
    DOCENTE: {
      BASE: "/saga/docentes",
    },
    MATERIA: {
      BASE: "/saga/materias",
    },
  },
} as const;
