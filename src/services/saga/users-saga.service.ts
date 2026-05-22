import http from "../http.service.ts";
import { API_ENDPOINTS } from "../../constants/api.constants.ts";
import type { User } from "../../types/users/user.types.ts";
import type { ApiResponse } from "../../types/common/api.types.ts";

export async function searchUsuariosSaga(query: string): Promise<User[]> {
    const { data } = await http.get<ApiResponse<User[]>>(
        API_ENDPOINTS.SAGA.USUARIOS.SEARCH,
        {
            params: {
                q: query,
            },
        }
    );
    return data.data;
}