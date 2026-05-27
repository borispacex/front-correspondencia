import { useState, useEffect, useCallback } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import RoleTable from "../../components/roles/RoleTable";
import RoleForm from "../../components/roles/RoleForm";
import { PlusIcon } from "../../icons";

import {
  getRolesPaginated,
  createRole,
  updateRole,
  deleteRole,
} from "../../services/admin/roles.service.ts";

import type {
  Role,
  CreateRoleRequest,
  RoleFilters,
} from "../../types/admin/roles/role.types";

import type { Pagination } from "../../types/common/api.types";

import { usePermissions } from "../../hooks/usePermissions";
import { useNotifications } from "../../hooks/useNotification.tsx";

import Button from "../../components/ui/button/Button.tsx";
import ModalDelete from "../../components/modal/ModalDelete.tsx";

export default function RolesListPage() {
  const { can } = usePermissions();

  const { addNotification } = useNotifications();
  const [roles, setRoles] = useState<Role[]>([]);
  const [pagination, setPagination] = useState<Omit<Pagination<Role>, "data"> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<RoleFilters>({});
  const [sort, setSort] = useState<string[]>([]);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);

    try {
      const filter: Record<string, string> = {};

      if (filters.name) {
        filter.name = filters.name;
      }

      if (filters.guard_name) {
        filter.guard_name = filters.guard_name;
      }

      const result = await getRolesPaginated({
        page,
        perPage,
        ...(sort.length ? { sort } : {}),
        ...(Object.keys(filter).length
            ? { filter }
            : {}),
      });

      const { data, ...meta } = result;

      setRoles(data);

      setPagination(meta);
    } catch {
      addNotification({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar los roles.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, filters, sort, addNotification]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  function handleFilterChange(newFilters: RoleFilters) {
    setPage(1);
    setFilters(newFilters);
  }

  function handleSortChange(newSort: string[]) {
    setPage(1);
    setSort(newSort);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  function handlePerPageChange(newPerPage: number) {
    setPage(1);
    setPerPage(newPerPage);
  }

  function handleCreate() {
    setSelectedRole(null);
    setIsModalOpen(true);
  }

  function handleEdit(role: Role) {
    setSelectedRole(role);
    setIsModalOpen(true);
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function handleConfirmDelete() {
    if (confirmId === null) {
      return;
    }

    try {
      setIsDeleting(true);

      const role = roles.find((r) => r.id === confirmId);

      await deleteRole(confirmId);

      addNotification({
        type: "success",
        title: "Rol eliminado",
        message: `El rol ${
            role?.name ?? ""
        } fue eliminado correctamente.`,
      });

      setConfirmId(null);

      fetchRoles();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      addNotification({
        type: "error",
        title: "Error",
        message:
            axiosErr?.response?.data?.message ??
            "Error al eliminar el rol.",
      });
    } finally {
      setIsDeleting(false);
      setConfirmId(null);
    }
  }

  async function handleSubmit(data: CreateRoleRequest) {
    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, {
          id: selectedRole.id,
          ...data,
        });

        addNotification({
          type: "info",
          title: "Rol actualizado",
          message: `El rol ${data.name} fue actualizado correctamente.`,
        });
      } else {
        await createRole(data);

        addNotification({
          type: "success",
          title: "Rol creado",
          message: `El rol ${data.name} fue creado correctamente.`,
        });
      }

      setIsModalOpen(false);

      fetchRoles();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      addNotification({
        type: "error",
        title: "Error",
        message:
            axiosErr?.response?.data?.message ??
            "Error al guardar el rol.",
      });
    }
  }

  return (
      <>
        <PageMeta
            title="Roles"
            description="Gestión de roles del sistema"
        />

        <PageBreadCrumb pageTitle="Roles" />

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Roles
            </h2>

            {can("roles.create") && (
                <Button
                    size={"sm"}
                    onClick={handleCreate}
                    startIcon={
                      <PlusIcon className="size-4 text-white" />
                    }
                >
                  Nuevo Rol
                </Button>
            )}
          </div>

          <RoleTable
              roles={roles}
              pagination={pagination}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onSortChange={handleSortChange}
          />
        </div>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="max-w-2xl p-6 sm:p-8"
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            {selectedRole
                ? "Editar Rol"
                : "Nuevo Rol"}
          </h3>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
          </p>

          <RoleForm
              role={selectedRole}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

        <ModalDelete
            isOpen={confirmId !== null}
            loading={isDeleting}
            onClose={() => setConfirmId(null)}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar este rol?"
            message="Esta acción no se puede deshacer."
        />
      </>
  );
}