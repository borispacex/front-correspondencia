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

  const base = `
  w-full
  appearance-none
  rounded-lg
  border
  shadow-theme-xs
  transition
  focus:outline-none
  ${sizeClasses[size]}
`;

  const stateClasses = disabled
    ? 'cursor-not-allowed opacity-60 bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
    : error
      ? 'bg-transparent border-error-500 text-gray-800 focus:border-error-300 focus:ring-error-500/20 dark:bg-gray-900 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800'
      : `bg-transparent border-gray-300 ${
          selectedValue ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-400'
        } focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;

  return (
    <div className="relative">
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        className={[base, stateClasses, className].filter(Boolean).join(' ')}
      >
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
