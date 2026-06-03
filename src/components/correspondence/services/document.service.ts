import type { ApiQueryParams, ApiResponse } from '../../../types/common/api.types.ts';
import http from '../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../utils/query.utils.ts';
import { Document } from '../types/documents/document.type.ts';

export async function getDocuments(params?: ApiQueryParams): Promise<Document[]> {
  const { data } = await http.get<ApiResponse<Document[]>>(API_ENDPOINTS.CORRESPONDENCE.DOCUMENT.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function getDocumentById(id: number): Promise<Document> {
  const { data } = await http.get<ApiResponse<Document>>(API_ENDPOINTS.CORRESPONDENCE.DOCUMENT.BY_ID(id));

  return data.data;
}
