import React from "react";

interface TextareaProps {
  id?: string;
  name?: string;

  placeholder?: string;

  rows?: number;

  value?: string;

  onChange?: (value: string) => void;

  className?: string;

  disabled?: boolean;

  error?: boolean;

  hint?: string;

  required?: boolean;

  maxLength?: number;
}

const TextArea: React.FC<TextareaProps> = ({
                                             id,
                                             name,

                                             placeholder = "Ingrese un texto",

                                             rows = 3,

                                             value = "",

                                             onChange,

                                             className = "",

                                             disabled = false,

                                             error = false,

                                             hint = "",

                                             required = false,

                                             maxLength,
                                           }) => {

  const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange?.(e.target.value);
  };

  let textareaClasses = `
        w-full
        rounded-lg
        border
        px-4
        py-2.5
        text-sm

        shadow-theme-xs

        transition

        focus:outline-none

        ${className}
    `;

  if (disabled) {

    textareaClasses += `
            cursor-not-allowed

            border-gray-300
            bg-gray-100

            text-gray-500

            opacity-60

            dark:border-gray-700
            dark:bg-gray-800
            dark:text-gray-400
        `;

  } else if (error) {

    textareaClasses += `
            border-error-500

            bg-transparent

            text-gray-900

            focus:border-error-500
            focus:ring-3
            focus:ring-error-500/10

            dark:border-error-500
            dark:bg-gray-900
            dark:text-white/90
            dark:focus:border-error-400
        `;

  } else {

    textareaClasses += `
            border-gray-300

            bg-transparent

            text-gray-900

            focus:border-brand-300
            focus:ring-3
            focus:ring-brand-500/10

            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white/90
            dark:focus:border-brand-800
        `;
  }

  return (
      <div className="relative">

            <textarea
                id={id}
                name={name}

                rows={rows}

                value={value}

                placeholder={placeholder}

                disabled={disabled}

                required={required}

                maxLength={maxLength}

                onChange={handleChange}

                className={textareaClasses}
            />

        {hint && (

            <p
                className={`mt-2 text-sm ${
                    error
                        ? "text-error-500"
                        : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {hint}
            </p>

        )}

      </div>
  );
};

export default TextArea;