import type { ChangeEvent } from 'react';
import Label from '../../../../form/Label.tsx';
import Select, { Option } from '../../../../form/Select.tsx';
import InputField from '../../../../form/input/InputField.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import Button from '../../../../ui/button/Button.tsx';
import { BrushCleaningIcon } from '../../../../../icons';

export interface ArchivedFilters {
  nro: string;
  origin: string;
  subject: string;
  priority: string;
  sender: string;
}

export interface ArchivedSortConfig {
  field: string;
  dir: 'asc' | 'desc';
}

interface ArchivedFilterProps {
  filters: ArchivedFilters;
  sort: ArchivedSortConfig;
  onFiltersChange: (filters: ArchivedFilters) => void;
  onSortChange: (sort: ArchivedSortConfig) => void;
}

export const ArchivedFilter = ({ filters, sort, onFiltersChange, onSortChange }: ArchivedFilterProps) => {
  const handleInputChange =
    (field: keyof ArchivedFilters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFiltersChange({ ...filters, [field]: e.target.value });
    };

  const handleSelectChange = (field: keyof ArchivedFilters) => (value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSortChange = (value: string) => {
    const [field, dir] = value.split(':');
    onSortChange({ field, dir: dir as 'asc' | 'desc' });
  };

  const clearFilters = () => {
    onFiltersChange({ nro: '', origin: '', subject: '', priority: '', sender: '' });
    onSortChange({ field: 'id', dir: 'desc' });
  };

  const PRIORITY_OPTIONS: Option[] = [
    { value: '', label: 'Todas' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'URGENTE', label: 'Urgente' },
    { value: 'ALTA', label: 'Alta' },
  ];

  const SORT_OPTIONS: Option[] = [
    { value: 'id:desc', label: 'Más reciente' },
    { value: 'id:asc', label: 'Más antiguo' },
    { value: 'priority_id:asc', label: 'Prioridad A→Z' },
    { value: 'doc_fecha_origen:desc', label: 'Fecha ↓' },
    { value: 'doc_fecha_origen:asc', label: 'Fecha ↑' },
  ];

  return (
    <div className="flex flex-wrap items-end gap-2">
      {/* Nro */}
      <div className="flex min-w-[100px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Nro Tramite
        </Label>
        <InputField size="xs" value={filters.nro} onChange={handleInputChange('nro')} placeholder="Buscar Nro…" />
      </div>

      {/* Procedencia */}
      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Procedencia
        </Label>
        <InputField
          size="xs"
          value={filters.origin}
          onChange={handleInputChange('origin')}
          placeholder="Buscar procedencia…"
        />
      </div>

      {/* Remitente */}
      <div className="flex min-w-[140px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Remitente
        </Label>
        <InputField
          size="xs"
          value={filters.sender}
          onChange={handleInputChange('sender')}
          placeholder="Buscar remitente…"
        />
      </div>

      {/* Objeto / Referencia */}
      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Objeto / Referencia
        </Label>
        <InputField
          size="xs"
          value={filters.subject}
          onChange={handleInputChange('subject')}
          placeholder="Buscar asunto…"
        />
      </div>

      {/* Prioridad */}
      <div className="flex min-w-[110px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Prioridad
        </Label>
        <Select
          size="xs"
          options={PRIORITY_OPTIONS}
          defaultValue={filters.priority}
          onChange={handleSelectChange('priority')}
          placeholder="Todas"
        />
      </div>

      {/* Ordenar */}
      <div className="flex min-w-[150px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
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

      {/* Limpiar */}
      <Tooltip content="Limpiar">
        <Button size="xs" variant="outline" onClick={clearFilters} className="h-[38px]">
          <BrushCleaningIcon width="20" height="20" />
        </Button>
      </Tooltip>
    </div>
  );
};
