import type {ApiQueryParams, ApiResponse} from "../../../types/common/api.types.ts";
import http from "../../../services/http.service.ts";
import {API_ENDPOINTS} from "../../../constants/api.constants.ts";
import {buildQueryParams} from "../../../utils/query.utils.ts";
import {Provided} from "../types/provided.type.ts";

export async function getProvides(params?: ApiQueryParams): Promise<Provided[]> {
    const { data } = await http.get<ApiResponse<Provided[]>>(API_ENDPOINTS.CORRESPONDENCE.PROVIDED.BASE, {
        params: params ? buildQueryParams(params) : undefined,
    });
    return data.data;
}