import { Document } from '../documents/document.type.ts';
import { TypeDocument } from '../catalog/type-document.type.ts';
import { Priority } from '../catalog/priority.type.ts';
import { StateDocument } from '../catalog/state-document.type.ts';
import { Procedure } from '../catalog/procedure.type.ts';

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
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  // children
  document?: Document;
  typeDocument?: TypeDocument;
  priority?: Priority;
  stateDocument?: StateDocument;
  procedure?: Procedure;
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
