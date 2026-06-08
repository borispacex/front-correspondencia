import { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  size?: 'xs' | 'sm' | 'md';
  variant?:
    | 'primary'
    | 'primary-outline'
    | 'secondary'
    | 'secondary-outline'
    | 'outline'
    | 'ghost'
    | 'ghost-outline'
    | 'success'
    | 'success-outline'
    | 'danger'
    | 'danger-outline'
    | 'warning'
    | 'warning-outline'
    | 'info'
    | 'info-outline'
    | 'purple'
    | 'purple-outline'
    | 'action'
    | 'action-outline'
    | 'icon';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  className = '',
  disabled = false,
  type = 'submit',
}) => {
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-3 text-sm',
    md: 'px-5 py-3.5 text-sm',
  };

  const variantClasses = {
    // Solid variants
    primary: 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',

    secondary:
      'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.03]',

    outline:
      'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]',

    ghost:
      'border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20',

    success: 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600',

    danger: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600',

    warning: 'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600',

    info: 'bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600',

    purple: 'bg-violet-500 text-white hover:bg-violet-600 dark:bg-violet-500 dark:hover:bg-violet-600',

    action: 'bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-600',

    icon: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] p-2',

    'primary-outline':
      'border border-brand-500 bg-transparent text-brand-500 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-500/10',

    'secondary-outline':
      'border border-gray-400 bg-transparent text-gray-600 hover:bg-gray-50 dark:border-gray-500 dark:text-gray-400 dark:hover:bg-white/[0.03]',

    'ghost-outline':
      'border border-blue-400 bg-transparent text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10',

    'success-outline':
      'border border-green-500 bg-transparent text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-500/10',

    'danger-outline':
      'border border-red-500 bg-transparent text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-500/10',

    'warning-outline':
      'border border-amber-500 bg-transparent text-amber-600 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-500/10',

    'info-outline':
      'border border-sky-500 bg-transparent text-sky-600 hover:bg-sky-50 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-500/10',

    'purple-outline':
      'border border-violet-500 bg-transparent text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-500/10',

    'action-outline':
      'border border-teal-500 bg-transparent text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-500/10',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
