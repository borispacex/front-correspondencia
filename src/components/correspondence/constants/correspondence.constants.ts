export const APP_NAME = 'EMI';

export const SYSTEMS = {
  //   Sistemas Administrativos
  RGP: {
    code: 'RGP',
    name: 'Registro y Gestión de Personal',
  },
  CORIN: {
    code: 'CORIN',
    name: 'Correspondencia Institucional',
  },
  // SIstemas Academicos
  RGA: {
    code: 'RGA',
    name: 'Registro y gestión académico',
  },
  IGAG: {
    code: 'IGA-G',
    name: 'INformación de gestión académica',
  },
  IGAP: {
    code: 'IGA-p',
    name: 'Información de gestión académica (posgrado)',
  },
} as const;
