import type {
  ApiQueryParams,
  ApiResponse,
  LaravelResourcePagination,
  Pagination,
} from '../../../types/common/api.types.ts';
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

export async function getDocumentsPaginated(params: ApiQueryParams): Promise<Pagination<Document>> {
  const { data } = await http.get<LaravelResourcePagination<Document>>(API_ENDPOINTS.CORRESPONDENCE.DOCUMENT.BASE, {
    params: buildQueryParams({ ...params, included: ['routers'] }),
  });
  return {
    data: data.data,
    current_page: data.meta.current_page,
    last_page: data.meta.last_page,
    per_page: data.meta.per_page,
    total: data.meta.total,
  };
}

export async function getDocumentById(id: number, params?: ApiQueryParams): Promise<Document> {
  const { data } = await http.get<ApiResponse<Document>>(API_ENDPOINTS.CORRESPONDENCE.DOCUMENT.BY_ID(id), {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}
