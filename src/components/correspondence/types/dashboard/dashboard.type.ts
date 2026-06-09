// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminMetrics {
  total_users: number;
  active_users: number;
  total_roles: number;
  total_departments: number;
  total_charges: number;
  total_permissions: number;
}

export interface RoleDistributionItem {
  name: string;
  users: number;
}

export interface UsersByUnitItem {
  unit: string;
  count: number;
}

export interface ChargesByDeptItem {
  dept: string;
  charges: number;
}

export interface PermissionCoverageItem {
  name: string;
  granted: number;
  denied: number;
}

export interface MenuItemStat {
  name: string;
  roles: number;
  active: boolean;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  roles: RoleDistributionItem[];
  users_by_unit: UsersByUnitItem[];
  users_monthly: number[]; // índice 0 = enero … 11 = diciembre
  charges_by_dept: ChargesByDeptItem[];
  permissions: PermissionCoverageItem[];
  menu_items: MenuItemStat[];
}

// ── Correspondencia ───────────────────────────────────────────────────────────

export interface CorrespMetrics {
  total_docs: number;
  pendientes: number;
  eficiencia: number; // 0–100
  total_routers: number;
}

export interface DocsByStateItem {
  state: string;
  count: number;
}

export interface DocsByTypeItem {
  type: string;
  count: number;
}

export interface DocsByPriorityItem {
  label: string;
  value: number;
}

export interface DocsMonthlyItem {
  mes: string;
  entrada: number;
  salida: number;
}

export interface DocsByUnitItem {
  unit: string;
  docs: number;
}

export interface ResponseTimeItem {
  rango: string;
  docs: number;
}

export interface TopDepartmentItem {
  name: string;
  sent: number;
  received: number;
}

export interface CorrespDashboardData {
  metrics: CorrespMetrics;
  docs_by_state: DocsByStateItem[];
  docs_by_type: DocsByTypeItem[];
  docs_by_priority: DocsByPriorityItem[];
  docs_monthly: DocsMonthlyItem[];
  docs_by_unit: DocsByUnitItem[];
  response_time: ResponseTimeItem[];
  top_departments: TopDepartmentItem[];
}
