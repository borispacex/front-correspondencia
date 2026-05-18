import { useEffect, useState } from "react";

import Label from "../form/Label";
import InputField from "../form/input/InputField";

import {
    createPermission,
    updatePermission,
} from "../../services/permissions.service";

import type { Permission } from "../../types/permissions/permission.types";

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
    const [formGroup, setFormGroup] = useState("");

    const [formError, setFormError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (permission) {
            setFormName(permission.name);
            setFormGroup(permission.group ?? "");
        } else {
            setFormName("");
            setFormGroup("");
        }
    }, [permission]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formName.trim()) {
            setFormError("El nombre es requerido");
            return;
        }

        setIsSubmitting(true);

        setFormError(null);

        try {
            const payload = {
                name: formName.trim(),
                group: formGroup.trim() || undefined,
            };

            if (permission) {
                await updatePermission(permission.id, payload);
            } else {
                await createPermission(payload);
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

            setFormError(
                axiosErr?.response?.data?.message ?? "Error al guardar"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>
                    Nombre <span className="text-error-500">*</span>
                </Label>

                <InputField
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej: roles.view"
                />
            </div>

            <div>
                <Label>Grupo</Label>

                <InputField
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    placeholder="Ej: Roles"
                />
            </div>

            {formError && (
                <p className="text-sm text-error-500">
                    {formError}
                </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Guardando..."
                        : permission
                            ? "Actualizar"
                            : "Crear"}
                </button>
            </div>
        </form>
    );
}