import type React from 'react';

interface RadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  label: string;

  onChange: (value: string) => void;

  className?: string;
  disabled?: boolean;

  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: {
    radio: 'h-4 w-4',
    dot: 'h-1.5 w-1.5',
    text: 'text-xs',
  },

  md: {
    radio: 'h-5 w-5',
    dot: 'h-2 w-2',
    text: 'text-sm',
  },

  lg: {
    radio: 'h-6 w-6',
    dot: 'h-2.5 w-2.5',
    text: 'text-base',
  },
};

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,

  onChange,

  className = '',
  disabled = false,

  size = 'md',
}) => {
  const styles = SIZE_CLASSES[size];

  return (
    <label
      htmlFor={id}
      className={`group relative inline-flex cursor-pointer items-center gap-3 font-medium transition-colors duration-200 select-none ${styles.text} ${
        disabled ? 'cursor-not-allowed text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'
      } ${className} `}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => {
          if (!disabled) {
            onChange(value);
          }
        }}
        className="sr-only"
      />

      <span
        className={`relative flex items-center justify-center rounded-full border transition-all duration-200 ${styles.radio} ${
          checked
            ? 'border-brand-500 bg-brand-500'
            : `group-hover:border-brand-400 dark:group-hover:border-brand-500 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900`
        } ${disabled ? `border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800` : ''} ${
          checked && !disabled ? 'shadow-[0_0_0_4px_rgba(59,130,246,0.10)]' : ''
        } `}
      >
        <span
          className={`rounded-full bg-white transition-all duration-200 ${styles.dot} ${
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          } `}
        />
      </span>

      <span>{label}</span>
    </label>
  );
};

export default Radio;
