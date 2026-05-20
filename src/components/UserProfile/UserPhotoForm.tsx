import {useEffect, useState} from "react";
import type {PhotoUserRequest} from "../../types/users/user.types.ts";
import Button from "../ui/button/Button.tsx";
import {AuthUser} from "../../types/auth/auth.types.ts";
import {CameraIcon} from "../../icons";

interface UserPhotoFormProps {
    user?: AuthUser | null;
    onSubmit: (data:  PhotoUserRequest) => Promise<void>;
    onCancel: () => void;
}

export default function UserPhotoForm({ user, onSubmit, onCancel }: UserPhotoFormProps) {

    const [photo, setPhoto] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [previewImage, setPreviewImage] = useState(
        user?.foto
            ? `/storage/users/${user.foto}`
            : "/images/user/owner.jpg"
    );

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!photo) {
            setError("La foto actual es requerido");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({
                photo,
            });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr?.response?.data?.message ?? "Error al actualizar usuario");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        setPhoto(user?.phone ?? "");
        setError(null);
    }, [user])

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-5">
                <div className="relative w-20 h-20">
                    <img
                        src={previewImage || "/images/user/owner.jpg"}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
                        <CameraIcon
                            className="fill-gray-700 dark:fill-gray-300"
                            width="16"
                            height="16"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sube una imagen cuadrada (200x200 píxeles).
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        en formato JPG o PNG. <span className="text-error-500"> * </span>
                    </p>
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
