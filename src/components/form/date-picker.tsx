import { useEffect, useRef } from "react";

import flatpickr from "flatpickr";

import { Spanish } from "flatpickr/dist/l10n/es.js";

import "flatpickr/dist/flatpickr.css";

import Label from "./Label";

import { CalenderIcon } from "../../icons";

interface DatePickerProps {
  id: string;

  label?: string;
  placeholder?: string;

  value?: string;

  onChange?: (date: string) => void;

  disabled?: boolean;
  required?: boolean;
  error?: boolean;

  mode?: "single" | "multiple" | "range" | "time";

  className?: string;
}

export default function DatePicker({
                                     id,

                                     label,
                                     placeholder,

                                     value,

                                     onChange,

                                     disabled = false,
                                     required = false,
                                     error = false,

                                     mode = "single",

                                     className = "",
                                   }: DatePickerProps) {

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {

    if (!inputRef.current) return;

    const instance = flatpickr(inputRef.current, {

      mode,

      static: true,

      monthSelectorType: "static",

      locale: Spanish,

      dateFormat: "d/m/Y",

      defaultDate: value || new Date(),

      disableMobile: true,

      onChange: (_selectedDates, dateStr) => {
        onChange?.(dateStr);
      },
    });

    return () => {
      instance.destroy();
    };

  }, [mode]);

  useEffect(() => {

    if (inputRef.current && value !== undefined) {
      inputRef.current.value = value;
    }

  }, [value]);

  return (
      <div>

        {label && (
            <Label htmlFor={id}>
              {label}

              {required && (
                  <span className="text-error-500"> *</span>
              )}
            </Label>
        )}

        <div className="relative">

          <input
              ref={inputRef}
              id={id}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                        h-11
                        w-full
                        appearance-none
                        rounded-lg
                        border
                        bg-transparent
                        px-4
                        py-2.5
                        pr-11
                        text-sm
                        text-gray-800
                        shadow-theme-xs
                        outline-none
                        transition

                        placeholder:text-gray-400

                        focus:ring-3

                        dark:bg-gray-900
                        dark:text-white/90
                        dark:placeholder:text-white/30

                        ${
                  error
                      ? `
                                    border-error-500
                                    focus:border-error-400
                                    focus:ring-error-500/20
                                  `
                      : `
                                    border-gray-300
                                    focus:border-brand-300
                                    focus:ring-brand-500/20

                                    dark:border-gray-700
                                    dark:focus:border-brand-800
                                  `
              }

                        ${
                  disabled
                      ? `
                                    cursor-not-allowed
                                    bg-gray-100
                                    opacity-60

                                    dark:bg-gray-800
                                  `
                      : ""
              }

                        ${className}
                    `}
          />

          <span
              className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        dark:text-gray-400
                    "
          >
                    <CalenderIcon className="size-5" />
                </span>

        </div>

      </div>
  );
}