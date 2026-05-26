
export interface Document {
    id: number;
    name?: string;
    nro: string;
    nro_tramite_antiguo?: string | number;
    procedencia?: string;
    objeto_referencia?: string;
    prioridad?: "NORMAL" | "ALTO" | "URGENTE";
    fecha?: string;
    remitente?: string;
    has_routes?: boolean;
    created_at?: string;
    updated_at?: string;
    active: boolean;
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
    dir: "asc" | "desc";
}



export interface CreateDocumentRequest {
    document_origin: "INTERNO" | "EXTERNO";
    procedure_type: string;
    document_date: string;
    created_date?: string;
    origin_area_id: number;
    document_type_id: number;
    priority: string;
    cite?: string;
    cite_number?: string;
    sender?: string;
    reference: string;
    attachments?: string;
    pages?: number;
    file?: File | null;
    active?: boolean;
}

export interface UpdateDocumentRequest {
    id: number;
    document_origin: "INTERNO" | "EXTERNO";
    procedure_type: string;
    document_date: string;
    created_date?: string;
    origin_area_id: number;
    document_type_id: number;
    priority: string;
    cite?: string;
    cite_number?: string;
    sender?: string;
    reference: string;
    attachments?: string;
    pages?: number;
    file?: File | null;
    active?: boolean;
}
export interface Area {
    id: number;
    name: string;
    active?: boolean;
}
export interface DocumentType {
    id: number;
    name: string;
    active?: boolean;
}