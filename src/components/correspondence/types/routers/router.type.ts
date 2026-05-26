import {Document} from "../documents/document.type.ts";


export interface Router {
    id: number;
    document_id: number;
    provided_id: string;
    state_document_id: number;
    type_document_id: number;
    procedure_id: number;
    priority_id: number;
    department_id_origen: number;
    user_id_origen: number;
    department_id_destino: number;
    user_id_destino: number;
    rout_aclaracion_proveido: string; //<p>FINES CONSIGUIENTES</p>;
    rout_anexos_document: string;
    rout_fojas_document: number;
    rout_cite_document: string;
    rout_referencia_document: string;
    rout_remite_document: string;
    rout_numero_cite: string;
    rout_recibe: string; // date
    rout_observacion: string | null;
    procedure_d_parent: string | null;
    procedure_d_id: string | null;
    procedure_id_parent_rec: string | null;
    rout_url_document: string | null;
    document: Document;
    created_at: string;
    updated_at: string;
    deleted_at: string | null
}