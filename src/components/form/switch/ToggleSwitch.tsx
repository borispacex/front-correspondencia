import { CheckLineIcon, CloseIcon } from "../../../icons";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;

    disabled?: boolean;
    loading?: boolean;

    size?: "xs" | "sm" | "md" | "lg";
    color?: "green" | "blue" | "red" | "gray";

    showIcon?: boolean;
    label?: string;

    activeText?: string;
    inactiveText?: string;

    className?: string;
}

export const ToggleSwitch = ({
                                 checked,
                                 onChange,

                                 disabled = false,
                                 loading = false,

                                 size = "md",
                                 color = "green",

                                 showIcon = true,
                                 label,

                                 activeText = "Activo",
                                 inactiveText = "Inactivo",

                                 className = "",
                             }: ToggleSwitchProps) => {
    const sizes = {
        xs: {
            container: "w-7 h-4",
            thumb: "h-3 w-3",
            translate: "translate-x-3",
            icon: "size-1.5",
        },
        sm: {
            container: "w-9 h-5",
            thumb: "h-4 w-4",
            translate: "translate-x-4",
            icon: "size-2",
        },
        md: {
            container: "w-11 h-6",
            thumb: "h-5 w-5",
            translate: "translate-x-5",
            icon: "size-2.5",
        },
        lg: {
            container: "w-14 h-7",
            thumb: "h-6 w-6",
            translate: "translate-x-7",
            icon: "size-3",
        },
    };

    const inactiveClasses =
        "bg-gray-200 border-gray-200 dark:bg-white/[0.05] dark:border-white/[0.08]";

    const colors = {
        blue: checked
            ? "border-brand-400 bg-brand-400/10"
            : inactiveClasses,

        green: checked
            ? "border-success-400 bg-success-400/10"
            : inactiveClasses,

        red: checked
            ? "border-error-400 bg-error-400/10"
            : inactiveClasses,

        gray: checked
            ? "border-gray-400 bg-gray-400/10"
            : inactiveClasses,
    };

    const currentSize = sizes[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled || loading}
                onClick={() => onChange(!checked)}
                className={`
          relative inline-flex shrink-0 items-center rounded-full border
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-500/20
          hover:opacity-90 active:scale-95
          
          ${currentSize.container}
          ${colors[color]}
          
          ${
                    disabled || loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                }
        `}
            >
        <span
            className={`
            inline-flex items-center justify-center rounded-full
            bg-white dark:bg-gray-100 border border-gray-200 dark:border-white/[0.08]
            shadow-theme-xs
            transform transition-all duration-200 ease-in-out
            
            ${currentSize.thumb}
            ${checked ? currentSize.translate : "translate-x-0.5"}
          `}
        >
          {showIcon &&
              (checked ? (
                  <CheckLineIcon
                      className={`${currentSize.icon} text-success-500`}
                  />
              ) : (
                  <CloseIcon
                      className={`${currentSize.icon} text-error-400`}
                  />
              ))}
        </span>
            </button>

            {(label || activeText || inactiveText) && (
                <span className="text-theme-sm text-gray-700 dark:text-gray-400">
          {label ?? (checked ? activeText : inactiveText)}
        </span>
            )}
        </div>
    );
};