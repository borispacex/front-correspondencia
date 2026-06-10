import type { ApiQueryParams, ApiResponse } from '../../../../types/common/api.types.ts';
import http from '../../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../../utils/query.utils.ts';
import { Priority } from '../../types/items/priority.type.ts';

export async function getPriorities(params?: ApiQueryParams): Promise<Priority[]> {
  const { data } = await http.get<ApiResponse<Priority[]>>(API_ENDPOINTS.CORRESPONDENCE.PRIORITY.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function getPriorityById(id: number): Promise<Priority> {
  const { data } = await http.get<ApiResponse<Priority>>(API_ENDPOINTS.CORRESPONDENCE.PRIORITY.BY_ID(id));
  return data.data;
}
