import type {LoginRequest, LoginResponse} from "../types/auth/auth.types.ts";
import http from "./http.service.ts";
import {API_ENDPOINTS} from "../constants/api.constants.ts";


export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
    );
    return data;
}

export async function loginMicrosoft(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
    );
    return data;
}