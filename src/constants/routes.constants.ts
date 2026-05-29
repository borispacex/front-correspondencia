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
    ROUTE_SHEET: '/correspondencia/hoja-ruta',
    DOCUMENTS: '/correspondencia/documentos',
    APPROVE_SIGN: '/correspondencia/aprobar-firmar',
  },
} as const;
