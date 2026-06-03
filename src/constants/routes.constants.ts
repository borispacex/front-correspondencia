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
      SHOW: '/correspondencia/tramite/:id',
      ALL: '/correspondencia/tramite',
      PENDING: '/correspondencia/tramite/bandeja-entrada',
      ATTENDED: '/correspondencia/tramite/bandeja-salida',
      ARCHIVED: '/correspondencia/tramite/archivados',
    },
    DOCUMENTS: '/correspondencia/documentos',
    SIGN_DOCUMENT: '/correspondencia/firma-digital',
  },
} as const;
