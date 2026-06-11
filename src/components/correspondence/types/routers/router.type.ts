import { Document } from '../documents/document.type.ts';

export interface Router {
  id: number;
  document_id: number;
  state_document_id: number;
  provided_id?: string;
  type_document_id: number;
  procedure_id?: number;
  priority_id: number;
  department_id_origen: number;
  user_id_origen: number;
  department_id_destino: number;
  user_id_destino?: number;
  rout_aclaracion_proveido?: string;
  rout_anexos_document?: string;
  rout_fojas_document?: number;
  rout_cite_document: string;
  rout_referencia_document: string;
  rout_remite_document: string;
  rout_numero_cite?: string;
  rout_recibe?: string;
  rout_observacion?: string;
  procedure_d_parent?: string;
  procedure_d_id?: number;
  procedure_id_parent_rec?: number;
  rout_url_document?: string;
  document?: Document;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CreateRouterRequest {
  document_id: number;
  department_id_destino: number;
  user_id_destino?: number;
  procedure_id?: number;
  state_document_id: number;
  provided_ids: string[];
  rout_aclaracion_proveido?: string;
  rout_observacion?: string;
}
