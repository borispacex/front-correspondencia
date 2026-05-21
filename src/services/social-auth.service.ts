import http from "./http.service";
import { API_ENDPOINTS } from "../constants/api.constants";
import {MicrosoftAuthResponse} from "../types/auth/auth.types";

export async function loginWithMicrosoftToken(
    accessToken: string
): Promise<MicrosoftAuthResponse> {
    const { data } = await http.post<MicrosoftAuthResponse>(
        API_ENDPOINTS.SOCIAL_AUTH.MICROSOFT,
        { access_token: accessToken }
    );
    return data;
}