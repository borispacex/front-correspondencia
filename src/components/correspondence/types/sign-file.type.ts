export type SignFileTab = 'pending_approval' | 'pending_signature';

export interface SignFileRoute {
  id: number;
  code: string;
  subject: string;
}

export interface SignFileAction {
  type: 'approve' | 'sign' | 'traceability' | 'view';
  enabled: boolean;
}

export interface SignFile {
  id: number;
  code: string;
  subject: string;
  documentType: string;
  route: SignFileRoute;
  createdAt: string;
  actionPerformed: string;
  status: SignFileTab;
  selected?: boolean;
  actions: SignFileAction[];
}

export interface SignFileFilters {
  code: string;
  route: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface SignFileSortConfig {
  field: string;
  dir: 'asc' | 'desc';
}
