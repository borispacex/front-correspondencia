import type { ApiQueryParams, ApiResponse } from '../../../../types/common/api.types.ts';
import http from '../../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../../utils/query.utils.ts';
import { StateDocument } from '../../types/state-document.type.ts';

export async function getStateDocuments(params?: ApiQueryParams): Promise<StateDocument[]> {
  const { data } = await http.get<ApiResponse<StateDocument[]>>(API_ENDPOINTS.CORRESPONDENCE.STATE_DOCUMENT.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}
export async function getStateDocumentById(id: number): Promise<StateDocument> {
  const { data } = await http.get<ApiResponse<StateDocument>>(API_ENDPOINTS.CORRESPONDENCE.STATE_DOCUMENT.BY_ID(id));
  return data.data;
}
