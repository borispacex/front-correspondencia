import { SignDocument } from '../types/sign-document.type.ts';

export async function getSignDocuments(): Promise<SignDocument[]> {
  return [
    {
      id: 1,
      code: 'AGETIC/DGE/UGAT/AIT/001/2025',
      subject: 'Solicitud de revisión técnica',
      documentType: 'Nota externa ciudadana',
      createdAt: '18/06/2025',
      actionPerformed: 'Revisé como DE',
      status: 'pending_approval',
      route: {
        id: 10,
        code: 'HRD/AGETIC/00062/2025',
        subject: 'Revisión tramite',
      },
      actions: [
        {
          type: 'approve',
          enabled: true,
        },
        {
          type: 'traceability',
          enabled: true,
        },
      ],
    },
  ];
}
