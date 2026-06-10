import type React from 'react';
import { useState, useEffect, useRef, useId } from 'react';
import CheckboxSkeleton from '../animation/CheckboxSkeleton.tsx';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'custom'; validate: (selected: string[]) => string | null };

interface MultiSelectProps {
  label?: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  rules?: ValidationRule[];
  searchable?: boolean;
  selectAll?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'min-h-9 text-xs py-1 pl-2.5 pr-2',
  md: 'min-h-11 text-sm py-1.5 pl-3 pr-3',
  lg: 'min-h-13 text-base py-2 pl-4 pr-4',
};

const tagSizeMap = {
  sm: 'text-xs py-0.5 pl-2 pr-1.5',
  md: 'text-sm py-1 pl-2.5 pr-2',
  lg: 'text-base py-1.5 pl-3 pr-2.5',
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  loading = false,
  placeholder = 'Seleccione opciones',
  hint,
  error: externalError,
  rules = [],
  searchable = false,
  selectAll = false,
  required = false,
  size = 'md',
  className = '',
}) => {
  const uid = useId();
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value! : internalSelected;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const error = externalError ?? (touched ? internalError : null);

  const filteredOptions =
    searchable && searchQuery
      ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

  const allSelectableSelected = options.filter((o) => !o.disabled).every((o) => selectedOptions.includes(o.value));

  // Validation
  const validate = (selected: string[]): string | null => {
    for (const rule of rules) {
      if (rule.type === 'required' && selected.length === 0) return rule.message ?? 'This field is required.';
      if (rule.type === 'min' && selected.length < rule.value)
        return rule.message ?? `Select at least ${rule.value} option${rule.value > 1 ? 's' : ''}.`;
      if (rule.type === 'max' && selected.length > rule.value)
        return rule.message ?? `Select at most ${rule.value} option${rule.value > 1 ? 's' : ''}.`;
      if (rule.type === 'custom') {
        const msg = rule.validate(selected);
        if (msg) return msg;
      }
    }
    return null;
  };

  useEffect(() => {
    if (touched) setInternalError(validate(selectedOptions));
  }, [selectedOptions, touched]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setTouched(true);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (!isOpen) setSearchQuery('');
  }, [isOpen, searchable]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const toggleDropdown = () => {
    if (!disabled && !loading) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    const opt = options.find((o) => o.value === optionValue);
    if (opt?.disabled) return;
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !loading) updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  const handleSelectAll = () => {
    const selectable = options.filter((o) => !o.disabled).map((o) => o.value);
    if (allSelectableSelected) {
      updateSelection([]);
    } else {
      updateSelection(selectable);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !loading) updateSelection([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) handleSelect(filteredOptions[focusedIndex].value);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setTouched(true);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else setFocusedIndex((p) => (p < filteredOptions.length - 1 ? p + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) setFocusedIndex((p) => (p > 0 ? p - 1 : filteredOptions.length - 1));
        break;
      case 'Tab':
        setIsOpen(false);
        setTouched(true);
        break;
    }
  };

  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const listboxId = `${uid}-listbox`;

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {/* Label */}
      <div className="mb-1.5 flex items-center gap-1">
        {label && (
          <label id={labelId} htmlFor={uid} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        {label && required && (
          <span className="text-sm leading-none text-red-500 dark:text-red-400" aria-hidden="true">
            *
          </span>
        )}
      </div>

      <div className="relative">
        {/* Trigger */}
        <div
          id={uid}
          ref={triggerRef}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={labelId}
          aria-controls={listboxId}
          aria-invalid={!!error}
          aria-describedby={[hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined}
          aria-disabled={disabled}
          aria-required={required}
          tabIndex={disabled || loading ? -1 : 0}
          className={[
            'catalog-start relative flex w-full cursor-pointer rounded-lg border transition-all duration-150 outline-none',
            sizeMap[size],
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-900/40'
              : 'border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-900/40',
            'bg-white dark:bg-gray-900',
            disabled || loading ? 'cursor-not-allowed bg-gray-50 opacity-50 dark:bg-gray-800' : '',
          ].join(' ')}
        >
          {/* Tags / Placeholder */}
          <div className="flex min-w-0 flex-auto flex-wrap gap-1.5">
            {loading ? (
              <div className="flex w-full items-center gap-2 py-1">
                <CheckboxSkeleton items={1} />
              </div>
            ) : selectedOptions.length > 0 ? (
              selectedOptions.map((val) => {
                const text = options.find((o) => o.value === val)?.label ?? val;
                return (
                  <span
                    key={val}
                    className={[
                      'group catalog-center inline-flex gap-1 rounded-full border border-transparent',
                      'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
                      'hover:border-blue-200 dark:hover:border-blue-700',
                      'transition-colors duration-100',
                      tagSizeMap[size],
                    ].join(' ')}
                  >
                    <span className="max-w-[160px] truncate">{text}</span>
                    <button
                      type="button"
                      onClick={(e) => removeOption(val, e)}
                      disabled={disabled || loading}
                      className="shrink-0 text-blue-400 transition-colors hover:text-blue-600 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-200"
                      aria-label={`Remove ${text}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.407 4.469a.75.75 0 0 1 1.061-1.061L7 5.94l2.532-2.531a.75.75 0 1 1 1.06 1.06L8.061 7l2.531 2.532a.75.75 0 1 1-1.06 1.06L7 8.061 4.468 10.593a.75.75 0 0 1-1.06-1.061L5.939 7 3.407 4.469Z"
                        />
                      </svg>
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="pointer-events-none leading-6 text-gray-400 select-none dark:text-gray-500">
                {placeholder}
              </span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1 self-center pl-2">
            {!loading && selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={clearAll}
                className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear all"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.293 4.293a1 1 0 0 1 1.414 0L8 6.586l2.293-2.293a1 1 0 1 1 1.414 1.414L9.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L6.586 8 4.293 5.707a1 1 0 0 1 0-1.414Z"
                  />
                </svg>
              </button>
            )}
            {!loading && (
              <span
                className={`text-gray-400 transition-transform duration-200 dark:text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.792 7.396 10 12.604l5.208-5.208" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
            className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {/* Search */}
            {searchable && (
              <div className="border-b border-gray-100 p-2 dark:border-gray-800">
                <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                  <svg
                    className="shrink-0 text-gray-400"
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="9" r="6" />
                    <path d="m17 17-3.5-3.5" />
                  </svg>
                  <input
                    ref={searchRef}
                    type="text"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-gray-200"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFocusedIndex(-1);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={handleKeyDown}
                    aria-label="Opciones de búsqueda"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.407 4.469a.75.75 0 0 1 1.061-1.061L7 5.94l2.532-2.531a.75.75 0 1 1 1.06 1.06L8.061 7l2.531 2.532a.75.75 0 1 1-1.06 1.061L7 8.061 4.468 10.593a.75.75 0 0 1-1.06-1.061L5.939 7 3.407 4.469Z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Select All */}
            {selectAll && !searchQuery && (
              <div
                onClick={handleSelectAll}
                className="flex cursor-pointer items-center gap-2.5 border-b border-gray-100 px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              >
                <span
                  className={[
                    'catalog-center flex h-4 w-4 shrink-0 justify-center rounded border transition-colors',
                    allSelectableSelected
                      ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-600 dark:bg-blue-600'
                      : 'border-gray-300 dark:border-gray-600',
                  ].join(' ')}
                >
                  {allSelectableSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {allSelectableSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                </span>
                <span className="ml-auto text-xs text-gray-400 tabular-nums dark:text-gray-500">
                  {selectedOptions.length}/{options.filter((o) => !o.disabled).length}
                </span>
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto overscroll-contain">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedOptions.includes(option.value);
                  const isFocused = index === focusedIndex;

                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={[
                        'catalog-center flex gap-2.5 px-3 py-2 transition-colors',
                        option.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                        isFocused && !option.disabled ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                        isSelected && !isFocused ? 'bg-blue-50/60 dark:bg-blue-900/10' : '',
                        !isFocused && !isSelected && !option.disabled
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                          : '',
                      ].join(' ')}
                    >
                      {/* Checkbox */}
                      <span
                        className={[
                          'catalog-center flex h-4 w-4 shrink-0 justify-center rounded border transition-colors duration-100',
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-600 dark:bg-blue-600'
                            : 'border-gray-300 dark:border-gray-600',
                        ].join(' ')}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M1.5 5L4 7.5L8.5 2.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>

                      <span className="truncate text-sm text-gray-800 dark:text-white/90">{option.label}</span>

                      {option.disabled && (
                        <span className="ml-auto text-xs text-gray-400 italic dark:text-gray-600">Unavailable</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hint / Error */}

      {error ? (
        <div className="mt-1.5 min-h-[1.25rem]">
          <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        </div>
      ) : hint ? (
        <div className="mt-1.5 min-h-[1.25rem]">
          <p id={hintId} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            {hint}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
