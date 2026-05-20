import { useState } from "react";
import type {ChangePasswordUserRequest} from "../../types/users/user.types.ts";
import Label from "../form/Label.tsx";
import InputField from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {AuthUser} from "../../types/auth/auth.types.ts";
import {formatDateBo} from "../../utils/format.utils.ts";
import {InfoIcon} from "../../icons";
import Tooltip from "../form/Tooltip.tsx";

interface UserChangePasswordFormProps {
    user?: AuthUser | null;
    onSubmit: (data:  ChangePasswordUserRequest) => Promise<void>;
    onCancel: () => void;
}

export default function UserChangePasswordForm({ user, onSubmit, onCancel }: UserChangePasswordFormProps) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function validatePassword(password: string): string | null {
        if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
        if (!/[a-z]/.test(password)) return "La contraseña debe tener al menos una letra minúscula";
        if (!/[A-Z]/.test(password)) return "La contraseña debe tener al menos una letra mayúscula";
        if (!/[0-9]/.test(password)) return "La contraseña debe tener al menos un número";
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`;]/.test(password)) return "La contraseña debe tener al menos un símbolo";
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!currentPassword) {
            setError("La contraseña actual es requerida");
            return;
        }
        if (!password) {
            setError("La nueva contraseña es requerida");
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }
        if (!passwordConfirmation) {
            setError("Debe confirmar la contraseña");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr?.response?.data?.message ?? "Error al cambiar contraseña");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div className="col-span-2 lg:col-span-1">
                    <Label>Contraseña actual <span className="text-error-500">*</span></Label>
                    <InputField type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        {'Contraseña nueva '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-medium">
                                        La contraseña debe contener:
                                    </p>

                                    <ul className="list-disc space-y-1 pl-4">
                                        <li>Mínimo 8 caracteres</li>
                                        <li>Una letra mayúscula</li>
                                        <li>Una letra minúscula</li>
                                        <li>Un número</li>
                                        <li>Un símbolo</li>
                                    </ul>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                        <br/>
                        <span className="text-xs text-gray-400 ml-1">(Recomendamos una contraseña segura)<span className="text-error-500"> *</span></span>
                    </Label>
                    <InputField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <Label>Confirmar contraseña
                        <br/>
                        <span className="text-xs text-gray-400 ml-1">(Las contraseñas deben coincidir)<span className="text-error-500"> *</span></span>
                    </Label>
                    <InputField type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" />
                </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-700" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                    <Label>Ultimo cambio de contraseña </Label>
                    <InputField type="text"
                                value={formatDateBo(user?.UltimoCambioContrasenia ?? user?.created_at)}
                                disabled />
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
