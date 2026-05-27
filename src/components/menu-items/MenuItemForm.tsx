import { useState, useEffect } from "react";
import type { MenuItem, CreateMenuItemRequest } from "../../types/admin/menu-items/menu-item.types";
import type { Role } from "../../types/admin/roles/role.types";
import { getRoles } from "../../services/admin/roles.service.ts";
import Label from "../form/Label";
import InputField from "../form/input/InputField";
import {
  GridIcon,
  UserIcon,
  GroupIcon,
  PieChartIcon,
  ListIcon,
  TableIcon,
  CalenderIcon,
  LockIcon,
  PageIcon,
} from "../../icons";
import Checkbox from "../form/input/Checkbox.tsx";
import Select from "../form/Select.tsx";
import CheckboxSkeleton from "../animation/CheckboxSkeleton.tsx";
import Button from "../ui/button/Button.tsx";
import {useFormValidation} from "../../hooks/useFormValidation.ts";

const ICON_OPTIONS: { value: string; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { value: "dashboard", label: "Dashboard", Icon: GridIcon },
  { value: "users", label: "Usuarios", Icon: UserIcon },
  { value: "group", label: "Roles", Icon: GroupIcon },
  { value: "chart", label: "Gráficos", Icon: PieChartIcon },
  { value: "list", label: "Lista", Icon: ListIcon },
  { value: "table", label: "Tablas", Icon: TableIcon },
  { value: "calendar", label: "Calendario", Icon: CalenderIcon },
  { value: "lock", label: "Permisos", Icon: LockIcon },
  { value: "page", label: "Página", Icon: PageIcon },
];

interface MenuItemFormProps {
  item?: MenuItem | null;
  allItems?: MenuItem[];
  onSubmit: (data: CreateMenuItemRequest) => Promise<void>;
  onCancel: () => void;
}

export default function MenuItemForm({ item, allItems = [], onSubmit, onCancel }: MenuItemFormProps) {
  // const [label, setLabel] = useState("");
  // const [url, setUrl] = useState("");
  // const [icon, setIcon] = useState("");
  // const [order, setOrder] = useState("");
  const {
    values,
    errors,
    setValue,
    setMultipleErrors,
  } = useFormValidation({
    label: "",
    url: "",
    icon: "",
    order: "",
  });

  const [active, setActive] = useState(true);
  const [parentId, setParentId] = useState<number | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadingRoles, setLoadingRoles] = useState(true);

  // Ítems que pueden ser padre: excluye el ítem actual y sus hijos
  const parentOptions = allItems.filter((i) => i.id !== item?.id && i.parent_id !== item?.id);

  useEffect(() => {
    setLoadingRoles(true);

    getRoles()
        .then((data) => setAllRoles(data))
        .catch(() => {})
        .finally(() => setLoadingRoles(false));
  }, []);

  useEffect(() => {
    setValue('label', item?.label ?? "");
    setValue('url', item?.url ?? "");
    setValue('icon', item?.icon ?? "");
    setValue('order', item?.order?.toString() ?? "");
    setActive(item?.active ?? true);
    setParentId(item?.parent_id ?? null);
    setSelectedRoleIds(item?.roles?.map((r) => r.id) ?? []);

  }, [item]);

  function toggleRole(id: number) {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function validate() {
    const newErrors: any = {};

    if (!values.label) newErrors.label = "Label es requerido";
    if (!values.url) newErrors.url = "Url es requerido";
    if (!values.icon) newErrors.icon = "Icon requerido";
    if (!values.order) newErrors.order = "Order requerido";

    setMultipleErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        label: values.label.trim(),
        url: values.url.trim() || null,
        icon: values.icon.trim() || null,
        order: values.order ? parseInt(values.order, 10) : undefined,
        active,
        parent_id: parentId,
        roles: selectedRoleIds,
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (axiosErr?.response?.data?.message) {
        console.log('Error al guardar el ítem');
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Etiqueta <span className="text-error-500">*</span></Label>
        <InputField value={values.label} onChange={(e) => setValue('label', e.target.value)}
                    placeholder="Ej: Dashboard"
                    error={!!errors.label}
                    hint={errors.label}
        />
      </div>
      <div>
        <Label>URL<span className="text-error-500">*</span></Label>
        <InputField value={values.url} onChange={(e) => setValue('url', e.target.value)}
                    placeholder="Ej: /dashboard"
                    error={!!errors.url}
                    hint={errors.url}
        />
      </div>

      <div>
        <Label>Icono<span className="text-error-500">*</span></Label>
        <div className={`mt-2 flex flex-wrap  gap-y-2 rounded-lg border  px-2 py-2 ${errors.icon ? "border-error-500 dark:border-error-700" : "border-gray-200 dark:border-gray-700"}` }>
        {ICON_OPTIONS.map(({ value, label: iconLabel, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('icon', values.icon === value ? "" : value)}
              title={iconLabel}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2 mx-1 text-xs transition-colors ${
                values.icon === value
                  ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                  : "border-gray-200 bg-white text-gray-500 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              <Icon className="size-5" />
              <span className="truncate w-full text-center">{iconLabel}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setValue('icon', "")}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2 text-xs transition-colors ${
              values.icon === ""
                ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            }`}
          >
            <span className="text-lg leading-none">—</span>
            <span>Ninguno</span>
          </button>
        </div>
        {errors.icon && <p className="text-sm text-error-500 mt-1">Icono es requerido</p>}
      </div>

      <div>
        <Label>Orden<span className="text-error-500">*</span></Label>
        <InputField type="number" value={values.order} onChange={(e) => setValue('order', e.target.value)}
                    placeholder="Ej: 1"
                    error={!!errors.order}
                    hint={errors.order}/>
      </div>
      <div>
        <Label>Ítem padre</Label>
        <Select
            defaultValue={parentId ? String(parentId) : ""}
            placeholder="— Sin padre (ítem raíz) —"
            onChange={(value) =>
                setParentId(value ? Number(value) : null)
            }
            options={parentOptions.map((opt) => ({
              value: String(opt.id),
              label: opt.parent_id
                  ? `↳ ${opt.label}`
                  : opt.label,
            }))}
        />
      </div>

      <div>
          <Label>Roles que pueden ver este ítem</Label>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
            {loadingRoles ? (
                <CheckboxSkeleton items={3} />
            ) : allRoles.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-gray-400">
                No hay roles registrados
              </div>
            ) : (
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {allRoles.map((role) => (
                      <Checkbox
                          key={role.id}
                          label={role.name}
                          checked={selectedRoleIds.includes(role.id)}
                          onChange={() => toggleRole(role.id)}
                          size="md"
                      />
                  ))}
                </div>
            )}
          </div>
      </div>


      <div className="flex items-center gap-3">
        <Checkbox
            label="Activo"
            checked={active}
            onChange={(checked) => setActive(checked)}
            size="md"
        />
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
        >
          {isSubmitting
              ? "Guardando..."
              : item
                  ? "Actualizar"
                  : "Crear"}
        </Button>
      </div>
    </form>
  );
}
