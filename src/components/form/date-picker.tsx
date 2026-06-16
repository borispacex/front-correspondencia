import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon, TimeIcon } from '../../icons';

interface DatePickerProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (date: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  hint?: string;
  className?: string;
  picker?: 'date' | 'datetime' | 'time';
  mode?: 'single' | 'multiple' | 'range';
}

export default function DatePicker({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  hint = '',
  className = '',
  picker = 'datetime',
  mode = 'single',
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);

  const isDateTime = picker === 'datetime';
  const isTimeOnly = picker === 'time';
  const enableTime = isDateTime || isTimeOnly;

  useEffect(() => {
    if (!inputRef.current) return;

    flatpickrRef.current = flatpickr(inputRef.current, {
      mode,
      static: true,
      monthSelectorType: 'static',
      locale: Spanish,
      enableTime,
      noCalendar: isTimeOnly,
      enableSeconds: false,
      time_24hr: true,
      dateFormat: isTimeOnly ? 'H:i' : isDateTime ? 'Y-m-d H:i' : 'Y-m-d',
      altInput: true,
      altFormat: isTimeOnly ? 'H:i' : isDateTime ? 'd/m/Y H:i' : 'd/m/Y',
      altInputClass: `
                    h-11
                    w-full
                    appearance-none
                    rounded-lg
                    border
                    bg-transparent
                    px-4
                    py-2.5
                    pr-11
                    text-sm
                    text-gray-800
                    shadow-theme-xs
                    transition-all
                    duration-200
                    outline-none
                    placeholder:text-gray-400
                    focus:ring-3
                    dark:bg-gray-900
                    dark:text-white/90
                    dark:placeholder:text-white/30
                    ${
                      error
                        ? `
                                border-error-500
                                focus:border-error-500
                                focus:ring-error-500/20
                                dark:border-error-500
                                dark:focus:border-error-400
                              `
                        : `
                                border-gray-300
                                focus:border-brand-300
                                focus:ring-brand-500/20
                                dark:border-gray-700
                                dark:focus:border-brand-800
                              `
                    }

                    ${
                      disabled || readOnly
                        ? `
                                cursor-not-allowed
                                bg-gray-100
                                dark:bg-gray-800
                                opacity-60
                              `
                        : ''
                    }

                    ${className}
                `,

      defaultDate: value || undefined,
      disableMobile: true,
      clickOpens: !readOnly,

      onChange: (_selectedDates, dateStr) => {
        onChange?.(dateStr);
      },

      onReady: (_selectedDates, _dateStr, instance) => {
        if (instance.altInput) {
          instance.altInput.placeholder = placeholder || '';
          if (readOnly) {
            instance.altInput.readOnly = true;
            instance.altInput.tabIndex = -1;
            instance.altInput.style.cursor = 'default';
          }
        }

        const footer = document.createElement('div');
        footer.className = `
                        flex
                        items-center
                        justify-between
                        gap-2
                        border-t
                        border-gray-200
                        dark:border-white/[0.08]
                        p-2
                    `;

        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.textContent = 'Limpiar';
        clearButton.className = `
                        rounded-md
                        border
                        border-gray-300
                        dark:border-white/[0.08]
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-gray-700
                        dark:text-gray-200
                        transition-colors
                        hover:bg-gray-100
                        dark:hover:bg-white/[0.08]
                    `;

        clearButton.addEventListener('click', () => {
          instance.clear();

          onChange?.('');
        });
        const nowButton = document.createElement('button');
        nowButton.type = 'button';
        nowButton.textContent = isTimeOnly ? 'Ahora' : enableTime ? 'Ahora' : 'Hoy';
        nowButton.className = `
                        rounded-md
                        bg-brand-500
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-white
                        transition-colors
                        hover:bg-brand-600
                    `;

        nowButton.addEventListener('click', () => {
          instance.setDate(new Date(), true);
        });
        if (!readOnly) {
          footer.appendChild(clearButton);
          footer.appendChild(nowButton);
          instance.calendarContainer.appendChild(footer);
        }
      },
    });

    return () => {
      flatpickrRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!flatpickrRef.current) return;
    if (!value) {
      flatpickrRef.current.clear();
      return;
    }

    flatpickrRef.current.setDate(value, false);
  }, [value]);

  useEffect(() => {
    if (!flatpickrRef.current?.altInput) return;
    const input = flatpickrRef.current.altInput;
    const errorClasses = [
      'border-error-500',
      'focus:border-error-500',
      'focus:ring-error-500/20',
      'dark:border-error-500',
      'dark:focus:border-error-400',
    ];

    const normalClasses = [
      'border-gray-300',
      'focus:border-brand-300',
      'focus:ring-brand-500/20',
      'dark:border-gray-700',
      'dark:focus:border-brand-800',
    ];

    if (error) {
      input.classList.remove(...normalClasses);
      input.classList.add(...errorClasses);
    } else {
      input.classList.remove(...errorClasses);
      input.classList.add(...normalClasses);
    }
  }, [error]);

  return (
    <div>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-error-500"> *</span>}
        </Label>
      )}
      <div className="relative">
        <input ref={inputRef} id={id} className="hidden" />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          {isTimeOnly ? <TimeIcon className="size-5" /> : <CalenderIcon className="size-5" />}
        </span>
      </div>
      {hint && (
        <p className={`mt-2 text-sm ${error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'}`}>{hint}</p>
      )}
    </div>
  );
}
