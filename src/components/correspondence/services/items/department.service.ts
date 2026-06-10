import type { ApiQueryParams, ApiResponse } from '../../../../types/common/api.types.ts';
import http from '../../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../../utils/query.utils.ts';
import { Department } from '../../types/items/department.type.ts';

export async function getDepartments(params?: ApiQueryParams): Promise<Department[]> {
  const { data } = await http.get<ApiResponse<Department[]>>(API_ENDPOINTS.CORRESPONDENCE.DEPARTMENT.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function getDepartmentById(id: number): Promise<Department> {
  const { data } = await http.get<ApiResponse<Department>>(API_ENDPOINTS.CORRESPONDENCE.DEPARTMENT.BY_ID(id));
  return data.data;
}
