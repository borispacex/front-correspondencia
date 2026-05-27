import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;

export function useFormValidation<T extends Record<string, any>>(initialValues: T) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Errors<T>>({});

    function setValue<K extends keyof T>(key: K, value: T[K]) {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));

        // 🔥 CLAVE: limpiar error SOLO si existía
        setErrors((prev) => {
            if (!prev[key]) return prev;

            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    }

    function setMultipleErrors(newErrors: Errors<T>) {
        setErrors(newErrors);
    }

    function resetForm(newValues?: T) {
        setValues(newValues ?? initialValues);
        setErrors({});
    }

    return {
        values,
        errors,
        setValue,
        setMultipleErrors,
        resetForm,
    };
}