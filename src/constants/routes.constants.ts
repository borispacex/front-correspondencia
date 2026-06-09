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
    DOCUMENTS: {
      MY_DOCUMENTS: {
        ALL: '/correspondencia/tramite/mis-tramites',
        SHOW: '/correspondencia/tramite/mis-tramites:id',
      },
      ALL_DOCUMENTS: {
        ALL: '/correspondencia/tramite/todos',
        SHOW: '/correspondencia/tramite/todos/:id',
      },
    },
    MAILBOX: {
      INBOX: {
        ALL: '/correspondencia/tramite/bandeja-entrada',
        SHOW: '/correspondencia/tramite/bandeja-entrada/:id',
      },
      OUTBOX: {
        ALL: '/correspondencia/tramite/bandeja-salida',
        SHOW: '/correspondencia/tramite/bandeja-salida/:id',
      },
    },
    CORRESPONDENCE: {
      PENDING: {
        ALL: '/correspondencia/tramite/sin-accion',
        SHOW: '/correspondencia/tramite/sin-accion/:id',
      },
      ARCHIVED: {
        ALL: '/correspondencia/tramite/archivado',
        SHOW: '/correspondencia/tramite/archivado/:id',
      },
    },
    FILE: '/correspondencia/archivos',
    SIGN_FILE: '/correspondencia/firma-digital',
  },
} as const;
