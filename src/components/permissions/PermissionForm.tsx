import { useEffect, useState } from "react";

import Label from "../form/Label";
import InputField from "../form/input/InputField";

import {
    createPermission,
    updatePermission,
} from "../../services/admin/permissions.service.ts";

import type { Permission } from "../../types/permissions/permission.types";

import Button from "../ui/button/Button.tsx";
import {useNotifications} from "../../hooks/useNotification.tsx";
import Select, {Option} from "../form/Select.tsx";


interface Props {
    permission?: Permission | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PermissionForm({
                                           permission,
                                           onSuccess,
                                           onCancel,
                                       }: Props) {
    const [formName, setFormName] = useState("");
    const [formGuardName, setFormGuardName] = useState<"web" | "api" | "">("");
    const [formGroup, setFormGroup] = useState("");

    const [formError, setFormError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const GUARD_OPTIONS: Option[] = [
        {value: 'web', label: 'WEB'},
        {value: 'api', label: 'API'}
    ];

    const { addNotification } = useNotifications();

    useEffect(() => {
        if (permission) {
            setFormName(permission.name ?? "");
            setFormGuardName(
                permission?.guard_name === "web"
                    ? "web"
                    : "api"
            );
            setFormGroup(permission.group ?? "");
        } else {
            setFormName("");
            setFormGuardName("");
            setFormGroup("");
        }
    }, [permission]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formName.trim()) {
            setFormError("El nombre es requerido");

            addNotification({
                type: "warning",
                title: "Campo requerido",
                message: "El nombre es obligatorio.",
            });

            return;
        }

        if (!formGuardName.trim()) {
            setFormError("El guard es requerido");

            addNotification({
                type: "warning",
                title: "Campo requerido",
                message: "El guard es obligatorio.",
            });

            return;
        }

        setIsSubmitting(true);

        setFormError(null);

        try {
            const payload = {
                name: formName.trim(),
                guard_name: formGuardName.trim(),
                group: formGroup.trim() || undefined,
            };

            if (permission) {
                await updatePermission(permission.id, payload);

                addNotification({
                    type: "info",
                    title: "Permiso actualizado",
                    message: `El permiso ${formName} fue actualizado correctamente.`,
                });
            } else {
                await createPermission(payload);

                addNotification({
                    type: "success",
                    title: "Permiso creado",
                    message: `El permiso ${formName} fue creado correctamente.`,
                });
            }

            onSuccess();
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };

            const errorMessage =
                axiosErr?.response?.data?.message ??
                "Error al guardar";

            setFormError(errorMessage);

            addNotification({
                type: "error",
                title: "Error",
                message: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>
                    Nombre
                    <span className="text-error-500">
                        {" "}
                        *
                    </span>
                </Label>

                <InputField
                    value={formName}
                    onChange={(e) =>
                        setFormName(e.target.value)
                    }
                    placeholder="Ej: roles.view"
                />
            </div>

            <div>
                <Label>
                    Guard
                    <span className="text-error-500">
                        {" "}
                        *
                    </span>
                </Label>

                <Select
                    options={GUARD_OPTIONS}
                    defaultValue={formGuardName}
                    onChange={(value) =>
                        setFormGuardName(value)
                    }
                    placeholder="Seleccione un guard"
                />
            </div>

            <div>
                <Label>Grupo</Label>

                <InputField
                    value={formGroup}
                    onChange={(e) =>
                        setFormGroup(e.target.value)
                    }
                    placeholder="Ej: Roles"
                />
            </div>

            {formError && (
                <p className="text-sm text-error-500">
                    {formError}
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
                        : permission
                            ? "Actualizar"
                            : "Crear"}
                </Button>
            </div>
        </form>
    );
}