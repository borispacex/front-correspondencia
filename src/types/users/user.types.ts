import {Role} from "../roles/role.types.ts";

export interface User {
  id: number;
  ci: string;
  name: string;
  last_name: string;
  mother_last_name: string;
  email: string;
  phone: string;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
  active: boolean;
}

export interface CreateUserRequest {
  ci: string;
  name: string;
  last_name: string;
  mother_last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  roles?: number[];
  active?: boolean;
}

export interface UpdateUserRequest {
  id: number;
  ci: string;
  name?: string;
  last_name?: string;
  mother_last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  roles?: number[];
  active?: boolean;
}
