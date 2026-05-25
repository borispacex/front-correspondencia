
export interface Roadmap {
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


export interface RoadmapFilters {
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

