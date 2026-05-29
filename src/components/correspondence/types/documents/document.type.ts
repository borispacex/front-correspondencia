export interface Document {
  id: number;
  department_id: number;
  type_document_id: number;
  priority_id: number;
  state_document_id: number;
  doc_fecha_origen?: string;
  doc_cite: string;
  doc_referencia: string;
  doc_procedencia: 'I' | 'E';
  doc_remite: string;
  created_at: string;
  updated_at: string;
  doc_anexos?: string;
  doc_fojas?: number;
  doc_numero_cite?: string;
  doc_contador?: number;
  procedure_id?: number;
  doc_url?: string;
  creator_user_name?: string;
  updater_user_name?: string;
  deleter_user_name?: string;
  CreatorIP?: string;
  UpdaterIP?: string;
  DeleterIP?: string;
  doc_parent?: number;
  deleted_at?: string | null;
  doc_dep_name?: string;
  doc_user_id?: number;
  // Joins para UI
  dep_name?: string;
  typ_name?: string;
  pri_name?: string;
  sdoc_name?: string;
  proc_name?: string;
}

export interface DocumentFilters {
  nro: string;
  old: string;
  origin: string;
  subject: string;
  priority: string;
}

export interface SortConfig {
  field: string;
  dir: 'asc' | 'desc';
}

// Campos compartidos entre Create y Update
interface DocumentRequestBase {
  doc_procedencia: 'I' | 'E';
  procedure_id?: number;
  doc_fecha_origen: string;
  department_id: number;
  type_document_id: number;
  priority_id: number;
  doc_cite?: string;
  doc_numero_cite?: string;
  doc_remite: string;
  doc_referencia: string;
  doc_anexos?: string;
  doc_fojas?: number;
  doc_url?: string;
  file?: File | null;
  active?: boolean;
}

export interface CreateDocumentRequest extends DocumentRequestBase {}

export interface UpdateDocumentRequest extends DocumentRequestBase {
  id: number;
}
