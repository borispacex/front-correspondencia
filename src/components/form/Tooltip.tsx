import type { ReactNode } from "react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
                                    content,
                                    children,
                                    position = "top",
                                }: TooltipProps) {
    const positions = {
        top: {
            wrapper:
                "bottom-full left-1/2 -translate-x-1/2 mb-2",
            animation:
                "translate-y-1 group-hover:translate-y-0",
            arrow:
                "top-full left-1/2 -translate-x-1/2 border-t-white dark:border-t-gray-900 border-x-transparent border-b-transparent",
        },

        bottom: {
            wrapper:
                "top-full left-1/2 -translate-x-1/2 mt-2",
            animation:
                "-translate-y-1 group-hover:translate-y-0",
            arrow:
                "bottom-full left-1/2 -translate-x-1/2 border-b-white dark:border-b-gray-900 border-x-transparent border-t-transparent",
        },

        left: {
            wrapper:
                "right-full top-1/2 -translate-y-1/2 mr-2",
            animation:
                "translate-x-1 group-hover:translate-x-0",
            arrow:
                "left-full top-1/2 -translate-y-1/2 border-l-white dark:border-l-gray-900 border-y-transparent border-r-transparent",
        },

        right: {
            wrapper:
                "left-full top-1/2 -translate-y-1/2 ml-2",
            animation:
                "-translate-x-1 group-hover:translate-x-0",
            arrow:
                "right-full top-1/2 -translate-y-1/2 border-r-white dark:border-r-gray-900 border-y-transparent border-l-transparent",
        },
    };

    return (
        <div className="group relative inline-flex">
            {children}

            <div
                className={`
          pointer-events-none
          absolute z-50

          invisible opacity-0 scale-95

          transition-all duration-200 ease-out

          group-hover:visible
          group-hover:opacity-100
          group-hover:scale-100

          ${positions[position].wrapper}
          ${positions[position].animation}
        `}
            >
                <div
                    className="
            relative

            w-max
            max-w-[280px]

            rounded-xl

            border border-gray-200
            dark:border-gray-700

            bg-white
            dark:bg-gray-900

            px-3 py-2

            text-sm
            leading-relaxed

            text-gray-700
            dark:text-gray-200

            shadow-xl
            shadow-black/5
            dark:shadow-black/25

            whitespace-normal
            break-words
          "
                >
                    {content}

                    {/* Arrow */}
                    <div
                        className={`
              absolute h-0 w-0 border-[6px]
              ${positions[position].arrow}
            `}
                    />
                </div>
            </div>
        </div>
    );
}