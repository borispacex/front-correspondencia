import React, { useEffect, useState } from 'react';

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

  size?: 'xs' | 'sm' | 'md';

  error?: boolean;

  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,

  placeholder = 'Seleccione',

  onChange,

  className = '',

  defaultValue = '',

  loading = false,

  disabled = false,

  size = 'md',

  error = false,

  hint = '',
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSelectedValue(value);

    onChange(value);
  };

  const sizeClasses = {
    xs: 'h-9 px-3 py-2 pr-9 text-xs',

    sm: 'h-10 px-3.5 py-2 pr-10 text-sm',

    md: 'h-11 px-4 py-2.5 pr-11 text-sm',
  };

  /* LOADING */
  if (loading) {
    return (
      <div
        className={`w-full animate-pulse rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 ${sizeClasses[
          size
        ]
          .split(' ')
          .find((c) => c.startsWith('h-'))} `}
      />
    );
  }

  let selectClasses = `
        w-full
        appearance-none
        rounded-lg
        border

        bg-transparent

        shadow-theme-xs

        transition

        focus:outline-none

        dark:bg-gray-900
        dark:text-white/90

        ${selectedValue ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-400'}

        ${disabled ? 'cursor-not-allowed opacity-60' : ''}

        ${sizeClasses[size]}
        ${className}
    `;

  if (error) {
    selectClasses += `
            border-error-500

            focus:border-error-500
            focus:ring-3
            focus:ring-error-500/10

            dark:border-error-500
            dark:focus:border-error-400
        `;
  } else {
    selectClasses += `
            border-gray-300

            focus:border-brand-300
            focus:ring-3
            focus:ring-brand-500/10

            dark:border-gray-700
            dark:focus:border-brand-800
        `;
  }

  return (
    <div className="relative">
      <select value={selectedValue} onChange={handleChange} disabled={disabled} className={selectClasses}>
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hint && (
        <p className={`mt-2 text-sm ${error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'}`}>{hint}</p>
      )}
    </div>
  );
};

export default Select;
