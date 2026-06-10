import type { ApiQueryParams, ApiResponse } from '../../../../types/common/api.types.ts';
import http from '../../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../../utils/query.utils.ts';
import { TypeDocument } from '../../types/items/type-document.type.ts';

export async function getTypeDocuments(params?: ApiQueryParams): Promise<TypeDocument[]> {
  const { data } = await http.get<ApiResponse<TypeDocument[]>>(API_ENDPOINTS.CORRESPONDENCE.TYPE_DOCUMENT.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}
export async function getTypeDocumentById(id: number): Promise<TypeDocument> {
  const { data } = await http.get<ApiResponse<TypeDocument>>(API_ENDPOINTS.CORRESPONDENCE.TYPE_DOCUMENT.BY_ID(id));
  return data.data;
}
