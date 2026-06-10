import type { ApiResponse } from '../../../../types/common/api.types.ts';
import http from '../../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../../constants/api.constants.ts';
import { AdminDashboardData, CorrespDashboardData } from '../../types/dashboard/dashboard.type.ts';

export async function getAdminDashboard(): Promise<AdminDashboardData[]> {
  const { data } = await http.get<ApiResponse<AdminDashboardData[]>>(API_ENDPOINTS.DASHBOARD.ADMIN);
  return data.data;
}

export async function getCorrespDashboard(): Promise<CorrespDashboardData[]> {
  const { data } = await http.get<ApiResponse<CorrespDashboardData[]>>(API_ENDPOINTS.DASHBOARD.CORRESP);
  return data.data;
}
