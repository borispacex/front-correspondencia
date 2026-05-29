import type { ApiQueryParams, ApiResponse } from '../../../types/common/api.types.ts';
import http from '../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../utils/query.utils.ts';
import { Procedure } from '../types/procedure.type.ts';

export async function getProcedures(params?: ApiQueryParams): Promise<Procedure[]> {
  const { data } = await http.get<ApiResponse<Procedure[]>>(API_ENDPOINTS.CORRESPONDENCE.PROCEDURE.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}
