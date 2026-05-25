import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;

  size?: "xs" | "sm" | "md";

  variant?:
      | "primary"
      | "outline"
      | "secondary"
      | "ghost"
      | "success"
      | "danger"
      | "icon";

  startIcon?: ReactNode;
  endIcon?: ReactNode;

  onClick?: () => void;

  disabled?: boolean;

  className?: string;

  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         size = "md",
                                         variant = "primary",
                                         startIcon,
                                         endIcon,
                                         onClick,
                                         className = "",
                                         disabled = false,
                                         type = "button",
                                       }) => {
  // Sizes
  const sizeClasses = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variants
  const variantClasses = {
    primary:
        "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",

    outline:
        "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]",

    secondary:
        "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.03]",

    ghost:
        "border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20",

    success:
        "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-600",

    danger:
        "bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600",

    icon:
        "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] p-2",
  };

  return (
      <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`
        inline-flex items-center justify-center gap-1.5
        rounded-lg font-medium transition
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
      >
        {startIcon && (
            <span className="flex items-center">
          {startIcon}
        </span>
        )}

        {children}

        {endIcon && (
            <span className="flex items-center">
          {endIcon}
        </span>
        )}
      </button>
  );
};

export default Button;