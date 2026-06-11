import type { ApiQueryParams, ApiResponse } from '../../../types/common/api.types.ts';
import http from '../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../utils/query.utils.ts';
import { Router } from '../types/routers/router.type.ts';

export async function getRouters(params?: ApiQueryParams): Promise<Router[]> {
  const { data } = await http.get<ApiResponse<Router[]>>(API_ENDPOINTS.CORRESPONDENCE.ROUTER.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function getRouterById(id: number, params?: ApiQueryParams): Promise<Router> {
  const { data } = await http.get<ApiResponse<Router>>(API_ENDPOINTS.CORRESPONDENCE.ROUTER.BY_ID(id), {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}
