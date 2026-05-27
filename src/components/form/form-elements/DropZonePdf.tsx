import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DropZonePdfProps {
    value?: File | null;

    onChange: (file: File | null) => void;

    maxSizeMB?: number;

    disabled?: boolean;

    required?: boolean;

    size?: "sm" | "md" | "lg";

    title?: string;

    description?: string;

    error?: boolean;

    hint?: string;
}

export default function DropZonePdf({
                                        value,
                                        onChange,
                                        maxSizeMB = 10,
                                        disabled = false,
                                        required = false,
                                        size = "md",
                                        title = "Arrastra tu PDF aquí",
                                        description = "Seleccione o arrastre un archivo PDF",

                                        error = false,
                                        hint = "",
                                    }: DropZonePdfProps) {

    const [internalError, setInternalError] =
        useState<string | null>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const sizeStyles = {
        sm: {
            container: "p-3",
            icon: "h-10 w-10",
            title: "text-sm",
            description: "text-xs",
        },
        md: {
            container: "p-4",
            icon: "h-12 w-12",
            title: "text-base",
            description: "text-sm",
        },
        lg: {
            container: "p-6 lg:p-9",
            icon: "h-[68px] w-[68px]",
            title: "text-theme-xl",
            description: "text-sm",
        },
    };

    const styles = sizeStyles[size];

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        fileRejections,
    } = useDropzone({
        multiple: false,
        disabled,
        maxFiles: 1,
        maxSize: maxSizeBytes,
        accept: {
            "application/pdf": [".pdf"],
        },

        onDrop: (acceptedFiles) => {
            setInternalError(null);

            if (acceptedFiles.length > 0) {
                onChange(acceptedFiles[0]);
            }
        },
    });

    useEffect(() => {
        if (fileRejections.length === 0) return;

        const firstError = fileRejections[0]?.errors?.[0];
        if (!firstError) return;

        switch (firstError.code) {
            case "file-invalid-type":
                setInternalError("Solo se permiten archivos PDF");
                break;
            case "file-too-large":
                setInternalError(`El archivo supera ${maxSizeMB}MB`);
                break;
            case "too-many-files":
                setInternalError("Solo se permite un archivo");
                break;
            default:
                setInternalError("Archivo no válido");
        }
    }, [fileRejections, maxSizeMB]);

    function removeFile(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        onChange(null);
        setInternalError(null);
    }

    // 🔥 PRIORIDAD DE ERROR: externo > interno
    const showError = error || !!internalError;

    const message = hint || internalError;

    return (
        <div className="space-y-3">

            {/* DROPZONE */}
            <div
                {...getRootProps()}
                className={`
                    transition
                    rounded-xl
                    border
                    border-dashed
                    cursor-pointer

                    ${styles.container}

                    ${
                    isDragActive
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }

                    ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-brand-500"
                }

                    ${
                    showError
                        ? "border-error-500"
                        : ""
                }
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center text-center">

                    <div
                        className={`
                            mb-2
                            flex
                            items-center
                            justify-center
                            rounded-full
                            bg-gray-200
                            text-gray-700
                            dark:bg-gray-800
                            dark:text-gray-400
                            ${styles.icon}
                        `}
                    >
                        <svg
                            className="fill-current"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 3.5L18.5 9H13V3.5ZM8 13H16V15H8V13ZM8 17H16V19H8V17Z" />
                        </svg>
                    </div>

                    <h4 className={`mb-1 font-semibold text-gray-800 dark:text-white/90 ${styles.title}`}>
                        {isDragActive ? "Suelte el PDF aquí" : title}
                    </h4>

                    <p className={`mb-2 max-w-[320px] text-gray-600 dark:text-gray-400 ${styles.description}`}>
                        {description}
                    </p>

                    <p className="mb-4 text-xs text-gray-500 dark:text-gray-500">
                        PDF • Máximo {maxSizeMB}MB
                        {required && (
                            <span className="ml-1 text-error-500">
                                • Obligatorio
                            </span>
                        )}
                    </p>

                </div>
            </div>

            {/* ERROR / HINT */}
            {message && (
                <p className={`text-sm ${
                    showError
                        ? "text-error-500"
                        : "text-gray-500 dark:text-gray-400"
                }`}>
                    {message}
                </p>
            )}

            {/* FILE */}
            {value && (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                            {value.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {(value.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={removeFile}
                        disabled={disabled}
                        className="text-sm text-error-500 hover:underline disabled:opacity-50"
                    >
                        Quitar
                    </button>

                </div>
            )}
        </div>
    );
}