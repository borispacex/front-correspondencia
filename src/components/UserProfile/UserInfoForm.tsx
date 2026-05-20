import {useEffect, useState} from "react";
import type {InfoUserRequest} from "../../types/users/user.types.ts";
import Label from "../form/Label.tsx";
import InputField from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {AuthUser} from "../../types/auth/auth.types.ts";
import {formatDateBo} from "../../utils/format.utils.ts";

interface UserInfoFormProps {
    user?: AuthUser | null;
    onSubmit: (data:  InfoUserRequest) => Promise<void>;
    onCancel: () => void;
}

export default function UserInfoForm({ user, onSubmit, onCancel }: UserInfoFormProps) {

    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!phone) {
            setError("El telefono actual es requerido");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({
                phone,
            });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr?.response?.data?.message ?? "Error al actualizar usuario");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        setPhone(user?.phone ?? "");
        setError(null);
    }, [user])

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                    <Label>CI</Label>
                    <InputField value={user?.ci} disabled/>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <Label>Nombre(s)</Label>
                    <InputField value={user?.name} disabled/>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <Label>Apellido paterno</Label>
                    <InputField value={user?.last_name} disabled />
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <Label>Apellido materno</Label>
                    <InputField value={user?.mother_last_name} disabled />
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <Label>Correo electronico</Label>
                    <InputField value={user?.email} disabled />
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <Label>Teléfono <span className="text-error-500"> *</span></Label>
                    <InputField value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="60514138" />
                </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-700" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                    <Label>Ultima actualización</Label>
                    <InputField value={formatDateBo(user?.updated_at ?? user?.created_at)} disabled />
                </div>
            </div>
            {error && <p className="text-sm text-error-500">{error}</p>}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Guardando..."
                        : "Actualizar"}
                </Button>
            </div>
        </form>
    );
}
