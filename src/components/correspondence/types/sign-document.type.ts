export type SignDocumentTab = 'pending_approval' | 'pending_signature';

export interface SignDocumentRoute {
  id: number;
  code: string;
  subject: string;
}

export interface SignDocumentAction {
  type: 'approve' | 'sign' | 'traceability' | 'view';
  enabled: boolean;
}

export interface SignDocument {
  id: number;
  code: string;
  subject: string;
  documentType: string;
  route: SignDocumentRoute;
  createdAt: string;
  actionPerformed: string;
  status: SignDocumentTab;
  selected?: boolean;
  actions: SignDocumentAction[];
}

export interface SignDocumentFilters {
  code: string;
  route: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface SignDocumentSortConfig {
  field: string;
  dir: 'asc' | 'desc';
}
