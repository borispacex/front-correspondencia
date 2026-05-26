import {Role} from "../admin/roles/role.types.ts";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface AuthRole {
  id: number;
  name: string;
  guard_name: string;
}

export interface AuthUser {
  id: number;
  username?: string;
  name: string;
  last_name?: string;
  mother_last_name?: string;
  ci: string;
  email: string;
  phone: string;
  foto: string;
  roles?: Role[];
  permissions?: string[];

  created_at?: string;
  updated_at?: string | null;
  UltimoCambioContrasenia?: string | null;
}

export interface MicrosoftAuthResponse {
  token_type: string;
  access_token: string;
  expires_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
