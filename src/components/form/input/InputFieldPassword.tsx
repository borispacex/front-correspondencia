import { useState } from "react";
import type React from "react";

import InputField from "./InputField.tsx";
import { EyeCloseIcon, EyeIcon } from "../../../icons";

interface InputFieldPasswordProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    id?: string;
    name?: string;
    placeholder?: string;

    disabled?: boolean;
    required?: boolean;

    autoComplete?: string;

    error?: boolean;
    success?: boolean;
    hint?: string;

    className?: string;
}

export const InputFieldPassword = ({
                                       value,
                                       onChange,
                                       id,
                                       name,
                                       placeholder = "••••••••",
                                       disabled = false,
                                       required = false,
                                       autoComplete = "current-password",
                                       error = false,
                                       success = false,
                                       hint,
                                       className = "",
                                   }: InputFieldPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <InputField
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                id={id}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                error={error}
                success={success}
                hint={hint}
                className={`pr-11 ${className}`}
            />

            {!disabled && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 z-30 -translate-y-1/2"
                >
                    {showPassword ? (
                        <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    ) : (
                        <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    )}
                </button>
            )}
        </div>
    );
};