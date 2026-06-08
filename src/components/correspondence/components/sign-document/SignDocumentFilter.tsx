import type { ChangeEvent } from 'react';
import { SignDocumentFilters, SignDocumentSortConfig } from '../../types/sign-document.type.ts';
import Select, { Option } from '../../../form/Select.tsx';
import Label from '../../../form/Label.tsx';
import InputField from '../../../form/input/InputField.tsx';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { BrushCleaningIcon } from '../../../../icons';

interface SignDocumentFilterProps {
  filters: SignDocumentFilters;
  sort: SignDocumentSortConfig;
  onFiltersChange: (filters: {
    code: string;
    route: string;
    subject: string;
    status: string;
    createdAt: string;
  }) => void;
  onSortChange: (sort: SignDocumentSortConfig) => void;
}

const STATUS_OPTIONS: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'SIGNED', label: 'Firmado' },
];

const SORT_OPTIONS: Option[] = [
  { value: 'created_at:desc', label: 'Más reciente' },
  { value: 'created_at:asc', label: 'Más antiguo' },
  { value: 'code:asc', label: 'Código A → Z' },
  { value: 'code:desc', label: 'Código Z → A' },
  { value: 'subject:asc', label: 'Asunto A → Z' },
  { value: 'subject:desc', label: 'Asunto Z → A' },
];

export default function SignDocumentFilter({ filters, sort, onFiltersChange, onSortChange }: SignDocumentFilterProps) {
  const handleInputChange =
    (field: keyof SignDocumentFilters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFiltersChange({
        ...filters,
        [field]: e.target.value,
      });
    };

  const handleSelectChange = (field: keyof SignDocumentFilters) => (value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSortChange = (value: string) => {
    const [field, dir] = value.split(':');

    onSortChange({
      field,
      dir: dir as 'asc' | 'desc',
    });
  };

  function clearFilters() {
    onFiltersChange({
      code: '',
      route: '',
      subject: '',
      status: '',
      createdAt: '',
    });

    onSortChange({
      field: 'created_at',
      dir: 'desc',
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      {/* Código */}
      <div className="flex min-w-[130px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Código
        </Label>

        <InputField
          size="xs"
          value={filters.code}
          onChange={handleInputChange('code')}
          placeholder="Buscar código..."
        />
      </div>

      {/* Tramite */}
      <div className="flex min-w-[140px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Trámite
        </Label>

        <InputField
          size="xs"
          value={filters.route}
          onChange={handleInputChange('route')}
          placeholder="Buscar ruta..."
        />
      </div>

      {/* Asunto */}
      <div className="flex min-w-[220px] flex-1 flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Asunto
        </Label>

        <InputField
          size="xs"
          value={filters.subject}
          onChange={handleInputChange('subject')}
          placeholder="Buscar asunto..."
        />
      </div>

      {/* Estado */}
      <div className="flex min-w-[140px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Estado
        </Label>

        <Select
          size="xs"
          options={STATUS_OPTIONS}
          defaultValue={filters.status}
          onChange={handleSelectChange('status')}
          placeholder="Todos"
        />
      </div>

      {/* Fecha */}
      <div className="flex min-w-[140px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Fecha
        </Label>

        <InputField size="xs" type="date" value={filters.createdAt} onChange={handleInputChange('createdAt')} />
      </div>

      {/* Orden */}
      <div className="flex min-w-[180px] flex-col gap-1">
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
      <Tooltip content="Limpiar filtros">
        <Button size="xs" variant="outline" onClick={clearFilters} className="h-[38px]">
          <BrushCleaningIcon width="18" height="18" />
        </Button>
      </Tooltip>
    </div>
  );
}
