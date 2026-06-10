import type { ChangeEvent } from 'react';
import Label from '../../../../form/Label.tsx';
import Select, { Option } from '../../../../form/Select.tsx';
import InputField from '../../../../form/input/InputField.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import Button from '../../../../ui/button/Button.tsx';
import { BrushCleaningIcon } from '../../../../../icons';
import { MyDocumentFilters, MyDocumentSortConfig } from '../../../hooks/Filters/useMyDocumentFilters.ts';

interface Props {
  filters: MyDocumentFilters;
  sort: MyDocumentSortConfig;
  onFiltersChange: (filters: MyDocumentFilters) => void;
  onSortChange: (sort: MyDocumentSortConfig) => void;
  onReset: () => void;
}

export const MyDocumentFilter = ({ filters, sort, onFiltersChange, onSortChange, onReset }: Props) => {
  const handleInputChange =
    (field: keyof MyDocumentFilters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFiltersChange({ ...filters, [field]: e.target.value });
    };

  const handleSelectChange = (field: keyof MyDocumentFilters) => (value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSortChange = (value: string) => {
    const [field, dir] = value.split(':');
    onSortChange({ field, dir: dir as 'asc' | 'desc' });
  };

  const PRIORITY_OPTIONS: Option[] = [
    { value: '', label: 'Todas' },
    { value: '2', label: 'Normal' },
    { value: '1', label: 'Urgente' },
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
          Nro
        </Label>
        <InputField size="xs" value={filters.nro} onChange={handleInputChange('nro')} placeholder="Buscar Nro…" />
      </div>

      {/* Procedencia */}
      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Cite
        </Label>
        <InputField
          size="xs"
          value={filters.nroCite}
          onChange={handleInputChange('nroCite')}
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
        <Button size="xs" variant="outline" onClick={onReset} className="h-[38px]">
          <BrushCleaningIcon width="20" height="20" />
        </Button>
      </Tooltip>
    </div>
  );
};
