import { useEffect, useState } from "react";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];

  placeholder?: string;

  onChange: (value: string) => void;

  className?: string;

  defaultValue?: string;

  loading?: boolean;

  disabled?: boolean;

  size?: "xs" | "sm" | "md";
}

const Select: React.FC<SelectProps> = ({
                                         options,
                                         placeholder = "Seleccione",
                                         onChange,
                                         className = "",
                                         defaultValue = "",
                                         loading = false,
                                         disabled = false,
                                         size = "md",
                                       }) => {
  const [selectedValue, setSelectedValue] =
      useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (
      e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    setSelectedValue(value);

    onChange(value);
  };

  // Sizes
  const sizeClasses = {
    xs: "h-9 px-3 py-2 pr-9 text-xs",
    sm: "h-10 px-3.5 py-2 pr-10 text-sm",
    md: "h-11 px-4 py-2.5 pr-11 text-sm",
  };

  /* LOADING */
  if (loading) {
    return (
        <div
            className={`
          w-full rounded-lg border border-gray-300
          bg-gray-100 animate-pulse
          dark:border-gray-700 dark:bg-gray-800
          ${sizeClasses[size].split(" ").find(c =>
                c.startsWith("h-")
            )}
        `}
        />
    );
  }

  return (
      <select
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled}
          className={`
        w-full appearance-none rounded-lg border
        border-gray-300 bg-transparent
        shadow-theme-xs
        focus:border-brand-300
        focus:outline-hidden
        focus:ring-3 focus:ring-brand-500/10
        dark:border-gray-700
        dark:bg-gray-900
        dark:text-white/90

        ${
              selectedValue
                  ? "text-gray-800 dark:text-white"
                  : "text-gray-400 dark:text-gray-400"
          }

        ${
              disabled
                  ? "cursor-not-allowed opacity-60"
                  : ""
          }

        ${sizeClasses[size]}
        ${className}
      `}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {options.map((option) => (
            <option
                key={option.value}
                value={option.value}
            >
              {option.label}
            </option>
        ))}
      </select>
  );
};

export default Select;