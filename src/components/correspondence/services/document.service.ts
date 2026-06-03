import type { ApiQueryParams, ApiResponse } from '../../../types/common/api.types.ts';
import http from '../../../services/http.service.ts';
import { API_ENDPOINTS } from '../../../constants/api.constants.ts';
import { buildQueryParams } from '../../../utils/query.utils.ts';
import { Document } from '../types/documents/document.type.ts';
import { PENDING_STATE_IDS, ATTENDED_STATE_IDS, ARCHIVED_STATE_IDS } from '../components/router/RouterStatusTabs.tsx';
import { documentCountStore } from '../context/DocumentCountContext.tsx';

export async function getDocuments(params?: ApiQueryParams): Promise<Document[]> {
  const { data } = await http.get<ApiResponse<Document[]>>(API_ENDPOINTS.CORRESPONDENCE.DOCUMENT.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });

  const docs = data.data;

  documentCountStore.set({
    all: docs.length,
    pending: docs.filter((d) => PENDING_STATE_IDS.includes(d.state_document_id)).length,
    attended: docs.filter((d) => ATTENDED_STATE_IDS.includes(d.state_document_id)).length,
    archived: docs.filter((d) => ARCHIVED_STATE_IDS.includes(d.state_document_id)).length,
  });

  return docs;
}

export async function getDocumentById(id: number): Promise<Document> {
  const { data } = await http.get<ApiResponse<Document>>(API_ENDPOINTS.CORRESPONDENCE.DOCUMENT.BY_ID(id));
  return data.data;
}
