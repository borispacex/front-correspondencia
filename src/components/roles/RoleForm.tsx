import { useState, useEffect, useMemo } from "react";

import type {
  Role,
  CreateRoleRequest,
} from "../../types/roles/role.types";

import type { Permission } from "../../types/permissions/permission.types";

import { getPermissions } from "../../services/admin/permissions.service.ts";

import Label from "../form/Label";
import InputField from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox.tsx";
import CheckboxSkeleton from "../animation/CheckboxSkeleton.tsx";
import Button from "../ui/button/Button.tsx";

import { useNotifications } from "../../hooks/useNotification.tsx";

interface RoleFormProps {
  role?: Role | null;
  onSubmit: (data: CreateRoleRequest) => Promise<void>;
  onCancel: () => void;
}

export default function RoleForm({
                                   role,
                                   onSubmit,
                                   onCancel,
                                 }: RoleFormProps) {
  const [name, setName] = useState("");

  const [allPermissions, setAllPermissions] =
      useState<Permission[]>([]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] =
      useState(false);

  const [error, setError] =
      useState<string | null>(null);

  const [groupLoading, setGroupLoading] =
      useState<boolean>(true);

  const { addNotification } = useNotifications();

  useEffect(() => {
    setGroupLoading(true);

    getPermissions()
        .then((data) => setAllPermissions(data))
        .catch(() => {})
        .finally(() => setGroupLoading(false));
  }, []);

  useEffect(() => {
    setName(role?.name ?? "");

    setError(null);

    if (role?.permissions && allPermissions.length > 0) {
      const rolePermIds = role.permissions.map(
          (p) => p.id
      );

      setSelectedIds(rolePermIds);
    } else {
      setSelectedIds([]);
    }
  }, [role, allPermissions]);

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();

    for (const p of allPermissions) {
      const nameParts = p.name.split(".");

      const group =
          p.group &&
          p.group.toLowerCase() !== "general"
              ? p.group
              : nameParts.length > 1
                  ? nameParts[0]
                  : p.group ?? p.name;

      if (!map.has(group)) {
        map.set(group, []);
      }

      map.get(group)!.push(p);
    }

    return Array.from(map.entries()).sort(([a], [b]) =>
        a.localeCompare(b)
    );
  }, [allPermissions]);

  function togglePermission(id: number) {
    setSelectedIds((prev) =>
        prev.includes(id)
            ? prev.filter((x) => x !== id)
            : [...prev, id]
    );
  }

  function toggleGroup(perms: Permission[]) {
    const ids = perms.map((p) => p.id);

    const allSelected = ids.every((id) =>
        selectedIds.includes(id)
    );

    if (allSelected) {
      setSelectedIds((prev) =>
          prev.filter((id) => !ids.includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...ids]),
      ]);
    }
  }

  async function handleSubmit(
      e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nombre es requerido");

      addNotification({
        type: "warning",
        title: "Campo requerido",
        message: "El nombre es obligatorio.",
      });

      return;
    }

    setIsSubmitting(true);

    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        permissions: selectedIds,
      });
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
          axiosErr?.response?.data?.message ??
          "Error al guardar el rol"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <form
          onSubmit={handleSubmit}
          className="space-y-5"
      >
        <div>
          <Label>
            Nombre{" "}
            <span className="text-error-500">
            *
          </span>
          </Label>

          <InputField
              value={name}
              onChange={(e) =>
                  setName(e.target.value)
              }
              placeholder="Ej: Administrador"
          />
        </div>

        <div>
          <Label>Permisos</Label>

          <div className="mt-2 rounded-lg border border-gray-200 dark:border-gray-700">
            {groupLoading ? (
                <div className="px-4 py-4">
                  <CheckboxSkeleton items={12} />
                </div>
            ) : grouped.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-gray-400">
                  No hay permisos registrados
                </div>
            ) : (
                <div>
                  {grouped.map(([group, perms]) => {
                    const groupIds = perms.map(
                        (p) => p.id
                    );

                    const allChecked =
                        groupIds.every((id) =>
                            selectedIds.includes(id)
                        );

                    const someChecked =
                        groupIds.some((id) =>
                            selectedIds.includes(id)
                        );

                    return (
                        <div
                            key={group}
                            className="border-b border-gray-100 last:border-0 dark:border-gray-700/50"
                        >
                          <button
                              type="button"
                              onClick={() =>
                                  toggleGroup(perms)
                              }
                              className="flex w-full items-center gap-2 bg-gray-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-100 dark:bg-white/[0.02] dark:text-gray-400 dark:hover:bg-white/[0.04]"
                          >
                            <Checkbox
                                checked={allChecked}
                                onChange={() =>
                                    toggleGroup(perms)
                                }
                                className={
                                  !allChecked &&
                                  someChecked
                                      ? "border-brand-400 bg-brand-200 dark:bg-brand-500/30"
                                      : ""
                                }
                            />

                            {group}
                          </button>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2">
                            {perms.map((perm) => (
                                <Checkbox
                                    key={perm.id}
                                    label={perm.name
                                        .split(".")
                                        .pop()}
                                    checked={selectedIds.includes(
                                        perm.id
                                    )}
                                    onChange={() =>
                                        togglePermission(
                                            perm.id
                                        )
                                    }
                                    size="sm"
                                />
                            ))}
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
        </div>

        {error && (
            <p className="text-sm text-error-500">
              {error}
            </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
          >
            {isSubmitting
                ? "Guardando..."
                : role
                    ? "Actualizar"
                    : "Crear"}
          </Button>
        </div>
      </form>
  );
}