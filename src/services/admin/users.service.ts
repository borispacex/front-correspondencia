import http from "../http.service.ts";
import { API_ENDPOINTS } from "../../constants/api.constants.ts";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types/admin/users/user.types.ts";
import type { ApiResponse, ApiQueryParams } from "../../types/common/api.types.ts";
import { buildQueryParams } from "../../utils/query.utils.ts";

export async function getUsers(params?: ApiQueryParams): Promise<User[]> {
  const { data } = await http.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.BASE, {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function getUsersByDepartment( deparment_id?: number): Promise<User[]> {
  const { data } = await http.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.BASE, {
    params: buildQueryParams({}) ,
  });
  return data.data;
}

export async function getUserById(id: number, params?: ApiQueryParams): Promise<User> {
  const { data } = await http.get<ApiResponse<User>>(API_ENDPOINTS.USERS.BY_ID(id), {
    params: params ? buildQueryParams(params) : undefined,
  });
  return data.data;
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
  const { data } = await http.post<ApiResponse<User>>(API_ENDPOINTS.USERS.BASE, payload);
  return data.data;
}

export async function updateUser(id: number, payload: UpdateUserRequest): Promise<User> {
  const { data } = await http.put<ApiResponse<User>>(API_ENDPOINTS.USERS.BY_ID(id), payload);
  return data.data;
}

export async function deleteUser(id: number): Promise<void> {
  await http.delete(API_ENDPOINTS.USERS.BY_ID(id));
}
