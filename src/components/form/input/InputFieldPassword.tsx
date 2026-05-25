import { useState } from "react";
import type React from "react";

import InputField from "./InputField.tsx";

import {
    EyeCloseIcon,
    EyeIcon,
} from "../../../icons";

interface InputFieldPasswordProps {
    value?: string;

    onChange?: (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => void;

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

    size?: "xs" | "sm" | "md";
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
                                       size = "md",
                                   }: InputFieldPasswordProps) => {
    const [showPassword, setShowPassword] =
        useState(false);

    const sizeClasses = {
        xs: {
            button: "right-3",
            icon: "size-4",
            padding: "pr-9",
        },

        sm: {
            button: "right-3.5",
            icon: "size-4.5",
            padding: "pr-10",
        },

        md: {
            button: "right-4",
            icon: "size-5",
            padding: "pr-11",
        },
    };

    return (
        <div className="relative">
            <InputField
                type={
                    showPassword
                        ? "text"
                        : "password"
                }
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
                size={size}
                className={`
          ${sizeClasses[size].padding}
          ${className}
        `}
            />

            {!disabled && (
                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                    className={`
            absolute top-1/2 z-30
            -translate-y-1/2
            ${sizeClasses[size].button}
          `}
                >
                    {showPassword ? (
                        <EyeIcon
                            className={`
                fill-gray-500
                dark:fill-gray-400
                ${sizeClasses[size].icon}
              `}
                        />
                    ) : (
                        <EyeCloseIcon
                            className={`
                fill-gray-500
                dark:fill-gray-400
                ${sizeClasses[size].icon}
              `}
                        />
                    )}
                </button>
            )}
        </div>
    );
};