import { useEffect, useRef, useState } from 'react';

import { SearchIcon } from '../../icons';

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

  size?: 'xs' | 'sm' | 'md';
}

export default function SearchSelect<T>({
  options,
  value = null,
  placeholder = 'Buscar...',
  disabled = false,
  loading = false,
  minLength = 3,
  showSearchButton = false,
  searchOnEnter = false,
  onChange,
  onSearch,
  getOptionLabel,
  getOptionValue,
  size = 'md',
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(getOptionLabel(value));
    }
  }, [value, getOptionLabel]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  // Sizes
  const sizeClasses = {
    xs: {
      input: 'h-9 px-3 py-2 pr-9 text-xs',
      icon: 'right-2.5',
      dropdownItem: 'px-3 py-2 text-xs',
    },

    sm: {
      input: 'h-10 px-3.5 py-2 pr-10 text-sm',
      icon: 'right-3',
      dropdownItem: 'px-3.5 py-2.5 text-sm',
    },

    md: {
      input: 'h-11 px-4 py-2.5 pr-11 text-sm',
      icon: 'right-3',
      dropdownItem: 'px-4 py-3 text-sm',
    },
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);

            if (e.target.value === '') {
              onChange(null);
            }
          }}
          onKeyDown={(e) => {
            if (searchOnEnter && e.key === 'Enter') {
              e.preventDefault();

              handleSearch();
            }
          }}
          className={`focus:border-brand-500 w-full rounded-lg border border-gray-300 bg-white text-gray-900 transition outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:disabled:bg-gray-800 ${sizeClasses[size].input} `}
        />

        {showSearchButton && (
          <button
            type="button"
            onClick={handleSearch}
            className={`hover:text-brand-500 absolute top-1/2 -translate-y-1/2 text-gray-400 transition dark:text-gray-500 ${sizeClasses[size].icon} `}
          >
            <SearchIcon width="18" height="18" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {query.trim().length < minLength ? (
            <div className={`text-gray-500 dark:text-gray-400 ${sizeClasses[size].dropdownItem} `}>
              Escriba al menos {minLength} caracteres
            </div>
          ) : loading ? (
            <div className={`text-gray-500 dark:text-gray-400 ${sizeClasses[size].dropdownItem} `}>Buscando...</div>
          ) : options.length === 0 ? (
            <div className={`text-gray-500 dark:text-gray-400 ${sizeClasses[size].dropdownItem} `}>Sin resultados</div>
          ) : (
            options.map((option) => (
              <button
                key={getOptionValue(option)}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full text-left text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 ${sizeClasses[size].dropdownItem} `}
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
