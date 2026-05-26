import http from "../http.service.ts";
import { API_ENDPOINTS } from "../../constants/api.constants.ts";
import type {User, ChangePasswordUserRequest, InfoUserRequest, PhotoUserRequest} from "../../types/admin/users/user.types.ts";
import type { ApiResponse,  } from "../../types/common/api.types.ts";

export async function changePasswordUser(payload: ChangePasswordUserRequest): Promise<User> {
    const { data } = await http.patch<ApiResponse<User>>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, payload);
    return data.data;
}

export async function infoUser(payload: InfoUserRequest): Promise<User> {
    const { data } = await http.patch<ApiResponse<User>>(API_ENDPOINTS.PROFILE.PHONE, payload);
    return data.data;
}

export async function photoUser(payload: PhotoUserRequest): Promise<User> {
    const formData = new FormData();
    formData.append("photo", payload.photo);
    const { data } = await http.patch<ApiResponse<User>>(
        API_ENDPOINTS.PROFILE.PHOTO,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return data.data;
}


