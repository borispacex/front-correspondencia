import type { ApiQueryParams, ApiResponse } from '../../../types/common/api.types.ts';
import http from '../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../utils/query.utils.ts';
import { Unit } from '../types/unit.type.ts';

export async function getUnits(params?: ApiQueryParams): Promise<Unit[]> {
  const { data } = await http.get<ApiResponse<Unit[]>>(API_ENDPOINTS.CORRESPONDENCE.UNIT.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}
