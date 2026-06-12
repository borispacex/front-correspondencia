import http from '../http.service.ts';
import { API_ENDPOINTS } from '../../constants/api.constants.ts';
import type { Permission } from '../../types/admin/permissions/permission.types.ts';
import type {
  ApiResponse,
  ApiQueryParams,
  Pagination,
  LaravelResourcePagination,
} from '../../types/common/api.types.ts';
import { buildQueryParams } from '../../utils/query.utils.ts';

export async function getPermissions(params?: ApiQueryParams): Promise<Permission[]> {
  const { data } = await http.get<ApiResponse<Permission[]>>(API_ENDPOINTS.PERMISSIONS.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function getPermissionsPaginated(params: ApiQueryParams): Promise<Pagination<Permission>> {
  const { data } = await http.get<LaravelResourcePagination<Permission>>(API_ENDPOINTS.PERMISSIONS.BASE, {
    params: buildQueryParams({ ...params }),
  });
  return {
    data: data.data,
    current_page: data.meta.current_page,
    last_page: data.meta.last_page,
    per_page: data.meta.per_page,
    total: data.meta.total,
  };
}

export async function getPermissionById(id: number, params?: ApiQueryParams): Promise<Permission> {
  const { data } = await http.get<ApiResponse<Permission>>(API_ENDPOINTS.PERMISSIONS.BY_ID(id), {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function createPermission(payload: {
  name: string;
  guard_name?: string;
  group?: string;
}): Promise<Permission> {
  const { data } = await http.post<ApiResponse<Permission>>(API_ENDPOINTS.PERMISSIONS.BASE, payload);
  return data.data;
}

export async function updatePermission(
  id: number,
  payload: Partial<{ name: string; guard_name: string; group: string }>,
): Promise<Permission> {
  const { data } = await http.put<ApiResponse<Permission>>(API_ENDPOINTS.PERMISSIONS.BY_ID(id), payload);
  return data.data;
}

export async function deletePermission(id: number): Promise<void> {
  await http.delete(API_ENDPOINTS.PERMISSIONS.BY_ID(id));
}
