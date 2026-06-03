export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/iniciar-sesion',
  SIGN_UP: '/registrarse',
  RESET_PASSWORD: '/restrablecer',
  PROFILE: '/perfil',
  // Admin
  ROLES: {
    LIST: '/admin/roles',
    CREATE: '/admin/roles/crear',
    EDIT: (id: number | string) => `/admin/roles/${id}/editar`,
  },
  PERMISSIONS: {
    LIST: '/admin/permisos',
  },
  MENU_ITEMS: {
    LIST: '/admin/menu-items',
  },
  USERS: {
    LIST: '/admin/usuarios',
    CREATE: '/admin/usuarios/crear',
    EDIT: (id: number | string) => `/admin/usuarios/${id}/editar`,
  },
  // Correspondencia
  CORRESPONDENCE: {
    ROUTE_SHEET: {
      ALL: '/correspondencia/tramite',
      SHOW: '/correspondencia/tramite/:id',
      PENDING: '/correspondencia/tramite/bandeja-entrada',
      PENDING_SHOW: '/correspondencia/tramite/bandeja-entrada/:id',
      ATTENDED: '/correspondencia/tramite/bandeja-salida',
      ATTENDED_SHOW: '/correspondencia/tramite/bandeja-salida/:id',
      ARCHIVED: '/correspondencia/tramite/archivados',
      ARCHIVED_SHOW: '/correspondencia/tramite/archivados/:id',
    },
    DOCUMENTS: '/correspondencia/documentos',
    SIGN_DOCUMENT: '/correspondencia/firma-digital',
  },
} as const;
