import { useEffect, useRef, useState } from "react";
import {SearchIcon} from "../../icons";

interface SearchSelectProps<T> {
    options: T[];

    value?: T | null;

    placeholder?: string;

    disabled?: boolean;

    loading?: boolean;

    minLength?: number;

    showSearchButton?: boolean;

    searchOnEnter?: boolean;

    onChange: (value: T | null) => void;

    onSearch?: (query: string) => void;

    getOptionLabel: (option: T) => string;

    getOptionValue: (option: T) => string | number;
}

export default function SearchSelect<T>({
                                            options,
                                            value = null,
                                            placeholder = "Buscar...",
                                            disabled = false,
                                            loading = false,
                                            minLength = 3,
                                            showSearchButton = false,
                                            searchOnEnter = false,
                                            onChange,
                                            onSearch,
                                            getOptionLabel,
                                            getOptionValue,
                                        }: SearchSelectProps<T>) {
    const [query, setQuery] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setQuery(getOptionLabel(value));
        }
    }, [value, getOptionLabel]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleSearch() {
        const trimmed = query.trim();

        if (trimmed.length < minLength) {
            return;
        }

        if (!onSearch) {
            return;
        }

        onSearch(trimmed);

        setIsOpen(true);
    }

    function handleSelect(option: T) {
        setQuery(getOptionLabel(option));

        setIsOpen(false);

        onChange(option);
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full"
        >
            <div className="relative">
                <input
                    type="text"
                    disabled={disabled}
                    value={query}
                    placeholder={placeholder}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);

                        if (e.target.value === "") {
                            onChange(null);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (searchOnEnter && e.key === "Enter") {
                            e.preventDefault();

                            handleSearch();
                        }
                    }}
                    className="
            h-11 w-full rounded-lg border
            border-gray-300 bg-white
            px-4 py-2 text-sm
            text-gray-900 outline-none
            transition

            placeholder:text-gray-400

            focus:border-brand-500

            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500

            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white
            dark:placeholder:text-gray-400
            dark:disabled:bg-gray-800

            pr-12
          "
                />

                {showSearchButton && (
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="
              absolute right-3 top-1/2
              -translate-y-1/2

              text-gray-400
              transition

              hover:text-brand-500

              dark:text-gray-500
            "
                    >
                        <SearchIcon width="18" height="18" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div
                    className="
            absolute z-50 mt-2
            max-h-64 w-full overflow-y-auto
            rounded-xl border border-gray-200
            bg-white shadow-lg

            dark:border-gray-700
            dark:bg-gray-900
          "
                >
                    {query.trim().length < minLength ? (
                        <div
                            className="
                px-4 py-3 text-sm
                text-gray-500
                dark:text-gray-400
              "
                        >
                            Escriba al menos {minLength} caracteres
                        </div>
                    ) : loading ? (
                        <div
                            className="
                px-4 py-3 text-sm
                text-gray-500
                dark:text-gray-400
              "
                        >
                            Buscando...
                        </div>
                    ) : options.length === 0 ? (
                        <div
                            className="
                px-4 py-3 text-sm
                text-gray-500
                dark:text-gray-400
              "
                        >
                            Sin resultados
                        </div>
                    ) : (
                        options.map((option) => (
                            <button
                                key={getOptionValue(option)}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className="
                  w-full px-4 py-3
                  text-left text-sm
                  text-gray-900 transition

                  hover:bg-gray-100

                  dark:text-white
                  dark:hover:bg-gray-800
                "
                            >
                                {getOptionLabel(option)}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}