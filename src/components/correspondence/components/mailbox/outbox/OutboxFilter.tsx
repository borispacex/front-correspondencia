import type { ChangeEvent } from 'react';
import Label from '../../../../form/Label.tsx';
import Select, { Option } from '../../../../form/Select.tsx';
import InputField from '../../../../form/input/InputField.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import Button from '../../../../ui/button/Button.tsx';
import { BrushCleaningIcon } from '../../../../../icons';
import { OutboxFilters, OutboxSortConfig } from '../../../hooks/filters/useOutboxFilters.ts';

interface Props {
  filters: OutboxFilters;
  sort: OutboxSortConfig;
  onFiltersChange: (filters: OutboxFilters) => void;
  onSortChange: (sort: OutboxSortConfig) => void;
  onReset: () => void;
}

export const OutboxFilter = ({ filters, sort, onFiltersChange, onSortChange, onReset }: Props) => {
  const handleInputChange = (field: keyof OutboxFilters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFiltersChange({ ...filters, [field]: e.target.value });
  };

  const handleSelectChange = (field: keyof OutboxFilters) => (value: string) => {
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

  const TYPE_DOCUMENT_OPTIONS: Option[] = [
    { value: '', label: 'Todas' },
    { value: '1', label: 'Oficio' },
    { value: '2', label: 'Nota de servicio' },
    { value: '3', label: 'Pedido' },
    { value: '4', label: 'Radiograma' },
    { value: '5', label: 'Correo electronico' },
    { value: '6', label: 'Memorandum' },
    { value: '7', label: 'Parte' },
    { value: '8', label: 'Papeleta' },
    { value: '9', label: 'Orden del dia' },
    { value: '10', label: 'Directica' },
    { value: '11', label: 'Resolución' },
    { value: '12', label: 'Acta' },
    { value: '13', label: 'Nota de entrega' },
    { value: '14', label: 'Solicitud' },
    { value: '15', label: 'Informe' },
    { value: '16', label: 'Certificacion' },
    { value: '17', label: 'Ejecución' },
    { value: '18', label: 'Notificación' },
    { value: '19', label: 'Instructivo' },
    { value: '20', label: 'Certificado' },
    { value: '21', label: 'Orden de servicio' },
    { value: '22', label: 'Plan de actividades' },
    { value: '23', label: 'Titulos de posgrado' },
    { value: '24', label: 'Otros' },
    { value: '25', label: 'Telefonema' },
    { value: '26', label: 'Memorial' },
    { value: '27', label: 'Carta' },
    { value: '28', label: 'Orden de servicio' },
  ];

  const SORT_OPTIONS: Option[] = [
    { value: 'id:desc', label: 'Más reciente' },
    { value: 'id:asc', label: 'Más antiguo' },
    { value: 'priority_id:asc', label: 'Prioridad A→Z' },
    { value: 'created_at:desc', label: 'Fecha ↓' },
    { value: 'created_at:asc', label: 'Fecha ↑' },
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

      {/* Nro cite */}
      <div className="flex min-w-[110px] flex-col gap-1">
        <Label size="xs" className="tracking-wide uppercase">
          Tipo documento
        </Label>
        <Select
          size="xs"
          options={TYPE_DOCUMENT_OPTIONS}
          defaultValue={filters.typeDocument}
          onChange={handleSelectChange('typeDocument')}
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
