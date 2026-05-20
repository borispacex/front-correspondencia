import type { ReactNode } from "react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;

    position?: "top" | "bottom" | "left" | "right";
    width?: string;
}

export default function Tooltip({
                                    content,
                                    children,
                                    position = "top",
                                    width = "w-72",
                                }: TooltipProps) {

    const positions = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
        <div className="relative inline-flex group">
            {children}

            <div
                className={`
                    absolute z-50 hidden
                    group-hover:block
                    rounded-lg border border-gray-200
                    bg-white p-3 text-xs text-gray-600
                    shadow-theme-lg
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-300
                    ${positions[position]}
                    ${width}
                `}
            >
                {content}
            </div>
        </div>
    );
}