import type { ChangeEvent } from "react";

import Button from "../../../ui/button/Button.tsx";

import Label from "../../../form/Label";
import InputField from "../../../form/input/InputField";
import Select, { Option } from "../../../form/Select.tsx";

import { BrushCleaningIcon } from "../../../../icons";
import Tooltip from "../../../form/Tooltip.tsx";

interface DocumentFilters {
    nro: string;
    old: string;
    origin: string;
    subject: string;
    priority: string;
}

interface SortConfig {
    field: string;
    dir: "asc" | "desc";
}

interface DocumentFilterProps {
    filters: DocumentFilters;
    sort: SortConfig;
    onFiltersChange: (filters: DocumentFilters) => void;
    onSortChange: (sort: SortConfig) => void;
}

export const DocumentFilter = ({
                                  filters,
                                  sort,
                                  onFiltersChange,
                                  onSortChange,
                              }: DocumentFilterProps) => {
    const handleInputChange =
        (field: keyof DocumentFilters) =>
            (
                e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
            ) => {
                onFiltersChange({
                    ...filters,
                    [field]: e.target.value,
                });
            };

    const handleSelectChange =
        (field: keyof DocumentFilters) =>
            (value: string) => {
                onFiltersChange({
                    ...filters,
                    [field]: value,
                });
            };

    const handleSortChange = (value: string) => {
        const [field, dir] = value.split(":");

        onSortChange({
            field,
            dir: dir as "asc" | "desc",
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            nro: "",
            old: "",
            origin: "",
            subject: "",
            priority: "",
        });

        onSortChange({
            field: "id",
            dir: "desc",
        });
    };

    const PRIORITY_OPTIONS: Option[] = [
        { value: "", label: "Todas" },
        { value: "normal", label: "Normal" },
        { value: "alto", label: "Alto" },
        { value: "urgente", label: "Urgente" },
    ];

    const SORT_OPTIONS: Option[] = [
        { value: "id:desc", label: "Más reciente" },
        { value: "id:asc", label: "Más antiguo" },
        { value: "prioridad:asc", label: "Prioridad A→Z" },
        { value: "fecha:desc", label: "Fecha ↓" },
        { value: "fecha:asc", label: "Fecha ↑" },
    ];

    return (
        <div className="flex flex-wrap items-end gap-2">
            <div className="flex min-w-[100px] flex-col gap-1">
                <Label
                    size="xs"
                    className=" uppercase tracking-wide">
                    Nro
                </Label>

                <InputField
                    value={filters.nro}
                    size="xs"
                    onChange={handleInputChange("nro")}
                    placeholder="Buscar Nro…"
                />
            </div>

            <div className="flex min-w-[120px] flex-col gap-1">
                <Label
                    size="xs"
                    className="uppercase tracking-wide">
                    Trámite antiguo
                </Label>

                <InputField
                    size="xs"
                    value={filters.old}
                    onChange={handleInputChange("old")}
                    placeholder="Buscar…"
                />
            </div>

            <div className="flex min-w-[160px] flex-1 flex-col gap-1">
                <Label
                    size="xs"
                    className=" uppercase tracking-wide">
                    Procedencia
                </Label>

                <InputField
                    size="xs"
                    value={filters.origin}
                    onChange={handleInputChange("origin")}
                    placeholder="Buscar procedencia…"
                />
            </div>

            <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                <Label size="xs" className="uppercase tracking-wide">
                    Objeto / Referencia
                </Label>

                <InputField
                    size="xs"
                    value={filters.subject}
                    onChange={handleInputChange("subject")}
                    placeholder="Buscar asunto…"
                />
            </div>

            <div className="flex min-w-[110px] flex-col gap-1">
                <Label size="xs" className="uppercase tracking-wide">
                    Prioridad
                </Label>

                <Select
                    size="xs"
                    options={PRIORITY_OPTIONS}
                    defaultValue={filters.priority}
                    onChange={handleSelectChange("priority")}
                    placeholder="Todas"
                />
            </div>

            <div className="flex min-w-[150px] flex-col gap-1">
                <Label size="xs" className="uppercase tracking-wide">
                    Ordenar por
                </Label>

                <Select
                    size="xs"
                    options={SORT_OPTIONS}
                    defaultValue={`${sort.field}:${sort.dir}`}
                    onChange={handleSortChange}
                    placeholder="Ordenar"
                />
            </div>

            <Tooltip content="Limpiar">
                <Button
                    size="xs"
                    variant="outline"
                    onClick={clearFilters}
                    className="h-[38px]"
                >
                    <BrushCleaningIcon width="20" height="20" />
                </Button>
            </Tooltip>
        </div>
    );
};