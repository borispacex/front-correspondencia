import {Role} from "../roles/role.types.ts";

export interface MenuItem {
  id: number;
  label: string;
  url: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  parent_id: number | null;
  children: MenuItem[];
  roles?: Role[];
}

export interface CreateMenuItemRequest {
  label: string;
  url?: string | null;
  icon?: string | null;
  order?: number;
  parent_id?: number | null;
  active?: boolean;
  roles?: number[];
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  id: number;
}
