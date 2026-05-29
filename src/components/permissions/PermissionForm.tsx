import { useEffect, useState } from 'react';

import Label from '../form/Label';
import InputField from '../form/input/InputField';

import { createPermission, updatePermission } from '../../services/admin/permissions.service.ts';

import type { Permission } from '../../types/admin/permissions/permission.types';

import Button from '../ui/button/Button.tsx';
import { useNotifications } from '../../hooks/useNotification.tsx';
import Select, { Option } from '../form/Select.tsx';
import { useFormValidation } from '../../hooks/useFormValidation.ts';

interface Props {
  permission?: Permission | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PermissionForm({ permission, onSuccess, onCancel }: Props) {
  const [formGroup, setFormGroup] = useState('');
  const { values, errors, setValue, setMultipleErrors } = useFormValidation({
    formName: '',
    formGuardName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const GUARD_OPTIONS: Option[] = [
    { value: 'web', label: 'WEB' },
    { value: 'api', label: 'API' },
  ];

  useEffect(() => {
    if (permission) {
      setValue('formName', permission.name ?? '');
      setValue('formGuardName', permission.guard_name === 'web' ? 'web' : 'api');
      setFormGroup(permission.group ?? '');
    } else {
      setValue('formGuardName', '');
      setValue('formGuardName', '');
      setFormGroup('');
    }
  }, [permission]);

  function validate() {
    const newErrors: any = {};

    if (!values.formName) newErrors.formName = 'El nombre es requerido';
    if (!values.formGuardName) newErrors.formGuardName = 'El guard es requerido';

    setMultipleErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: values.formName.trim(),
        guard_name: values.formGuardName,
        group: formGroup.trim() || undefined,
      };

      if (permission) {
        await updatePermission(permission.id, payload);

        addNotification({
          type: 'info',
          title: 'Permiso actualizado',
          message: `El permiso ${values.formName} fue actualizado correctamente.`,
        });
      } else {
        await createPermission(payload);

        addNotification({
          type: 'success',
          title: 'Permiso creado',
          message: `El permiso ${values.formName} fue creado correctamente.`,
        });
      }

      onSuccess();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };

      const message = axiosErr?.response?.data?.message ?? 'Error al guardar';

      addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NAME */}
      <div>
        <Label>
          Nombre <span className="text-error-500">*</span>
        </Label>

        <InputField
          value={values.formName}
          onChange={(e) => setValue('formName', e.target.value)}
          placeholder="Ej: roles.view"
          error={!!errors.formName}
          hint={errors.formName}
        />
      </div>

      {/* GUARD */}
      <div>
        <Label>
          Guard <span className="text-error-500">*</span>
        </Label>

        <Select
          options={GUARD_OPTIONS}
          defaultValue={values.formGuardName}
          onChange={(value) => setValue('formGuardName', value as 'web' | 'api')}
          placeholder="Seleccione un guard"
          error={!!errors.formGuardName}
          hint={errors.formGuardName}
        />
      </div>

      {/* GROUP */}
      <div>
        <Label>Grupo</Label>

        <InputField value={formGroup} onChange={(e) => setFormGroup(e.target.value)} placeholder="Ej: Roles" />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : permission ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
