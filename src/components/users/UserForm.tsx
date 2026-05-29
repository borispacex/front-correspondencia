import { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../types/admin/users/user.types';
import type { Role } from '../../types/admin/roles/role.types';
import { getRoles } from '../../services/admin/roles.service.ts';
import Label from '../form/Label';
import InputField from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox.tsx';
import Button from '../ui/button/Button.tsx';
import CheckboxSkeleton from '../animation/CheckboxSkeleton.tsx';
import { InputFieldPassword } from '../form/input/InputFieldPassword.tsx';
import SearchSelect from '../form/SearchSelect.tsx';
import { searchUsuariosSaga } from '../../services/saga/users-saga.service.ts';
import { useFormValidation } from '../../hooks/useFormValidation.ts';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [active, setActive] = useState(true);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadingRoles, setLoadingRoles] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const { values, errors, setValue, setMultipleErrors } = useFormValidation({
    ci: '',
    name: '',
    lastName: '',
    motherLastname: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
  });

  useEffect(() => {
    setLoadingRoles(true);

    getRoles()
      .then((data) => setAllRoles(data))
      .catch(() => {})
      .finally(() => setLoadingRoles(false));
  }, []);

  useEffect(() => {
    setValue('ci', user?.ci ?? '');
    setValue('name', user?.name ?? '');
    setValue('lastName', user?.last_name ?? '');
    setValue('motherLastname', user?.mother_last_name ?? '');
    setValue('email', user?.email ?? '');
    setValue('phone', user?.phone ?? '');
    setValue('password', '');
    setActive(user?.active ?? true);
    setValue('passwordConfirmation', '');
    setError(null);
    if (user?.roles && allRoles.length > 0) {
      const matched = allRoles.filter((r) => user.roles!.some((ur) => ur.name === r.name)).map((r) => r.id);
      setSelectedRoleIds(matched);
    } else {
      setSelectedRoleIds([]);
    }
  }, [user, allRoles]);

  useEffect(() => {
    if (!user) {
      setValue('password', values.ci);
      setValue('passwordConfirmation', values.ci);
    }
  }, [values.ci, user]);

  useEffect(() => {
    if (!selectedUser) return;
    setValue('ci', selectedUser.ci ?? '');
    setValue('name', selectedUser.name ?? '');
    setValue('lastName', selectedUser.last_name ?? '');
    setValue('motherLastname', selectedUser.mother_last_name ?? '');
    setValue('email', selectedUser.email ?? '');
    setValue('phone', selectedUser.phone ?? '');
  }, [selectedUser]);

  function toggleRole(id: number) {
    setSelectedRoleIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      if (user) {
        const payload: UpdateUserRequest = {
          id: user.id,
          ci: values.ci.trim(),
          name: values.name.trim(),
          last_name: values.lastName.trim(),
          mother_last_name: values.motherLastname.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          roles: selectedRoleIds,
          active: active,
        };
        if (values.password) {
          payload.password = values.password;
          payload.password_confirmation = values.passwordConfirmation;
        }
        await onSubmit(payload);
      } else {
        await onSubmit({
          ci: values.ci.trim(),
          name: values.name.trim(),
          last_name: values.lastName.trim(),
          mother_last_name: values.motherLastname.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          roles: selectedRoleIds,
        });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? 'Error al guardar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSearch(query: string) {
    try {
      setLoading(true);
      const data = await searchUsuariosSaga(query);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const newErrors: any = {};

    if (!values.ci) newErrors.ci = 'CI es requerido';
    if (!values.name) newErrors.name = 'Nombre es requerido';
    if (!values.lastName) newErrors.lastName = 'Apellido paterno requerido';
    if (!values.motherLastname) newErrors.motherLastname = 'Apellido materno requerido';
    if (!values.email) newErrors.email = 'Correo requerido';
    if (!values.phone) newErrors.phone = 'Teléfono requerido';

    if (!user && !values.password) {
      newErrors.password = 'Contraseña requerida';
    }
    if (!user && !values.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Confirmar contraseña requerida';
    }

    if (!user && values.password !== values.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Las contraseñas no coinciden';
    }

    setMultipleErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return (
    <>
      <div className="pb-3">
        <Label>Buscar de usuario</Label>
        <div className="max-w-xl">
          <SearchSelect
            options={users}
            value={selectedUser}
            loading={loading}
            onSearch={handleSearch}
            onChange={setSelectedUser}
            placeholder="Buscar usuario..."
            showSearchButton
            searchOnEnter
            getOptionValue={(user) => user.id}
            getOptionLabel={(user) => `${user.ci} - ${user.name} ${user.last_name} ${user.mother_last_name}`}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Ci <span className="text-error-500">*</span>
            </Label>
            <InputField
              value={values.ci}
              onChange={(e) => setValue('ci', e.target.value)}
              placeholder="9884972"
              error={!!errors.ci}
              hint={errors.ci}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Nombre(s) <span className="text-error-500">*</span>
            </Label>
            <InputField
              value={values.name}
              onChange={(e) => setValue('name', e.target.value)}
              placeholder="Juan"
              error={!!errors.name}
              hint={errors.name}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Apellido paterno <span className="text-error-500">*</span>
            </Label>
            <InputField
              value={values.lastName}
              onChange={(e) => setValue('lastName', e.target.value)}
              placeholder="Perez"
              error={!!errors.lastName}
              hint={errors.lastName}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Apellido materno <span className="text-error-500">*</span>
            </Label>
            <InputField
              value={values.motherLastname}
              onChange={(e) => setValue('motherLastname', e.target.value)}
              placeholder="Lopez"
              error={!!errors.motherLastname}
              hint={errors.motherLastname}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Correo electrónico <span className="text-error-500">*</span>
            </Label>
            <InputField
              type="email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              placeholder="correo@adm.emi.edu.bo"
              error={!!errors.email}
              hint={errors.email}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Teléfono <span className="text-error-500">*</span>
            </Label>
            <InputField
              value={values.phone}
              onChange={(e) => setValue('phone', e.target.value)}
              placeholder="60514138"
              error={!!errors.phone}
              hint={errors.phone}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Contraseña
              <br />
              <span className="ml-1 text-xs text-gray-400">
                {user ? '(Dejar en blanco para no cambiar)' : '(Recomendamos una contraseña segura)'}
              </span>
              <span className="text-error-500"> *</span>
            </Label>
            <InputFieldPassword
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
              placeholder="••••••••"
              error={!!errors.password}
              hint={errors.password}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>
              Confirmar contraseña
              <br />
              <span className="ml-1 text-xs text-gray-400">
                {user ? '(Dejar en blanco para no cambiar)' : '(Las contraseñas deben coincidir)'}
                <span className="text-error-500"> *</span>
              </span>
            </Label>
            <InputFieldPassword
              value={values.passwordConfirmation}
              onChange={(e) => setValue('passwordConfirmation', e.target.value)}
              placeholder="••••••••"
              error={!!errors.passwordConfirmation}
              hint={errors.passwordConfirmation}
            />
          </div>
        </div>

        <div>
          <Label>Roles</Label>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
            {loadingRoles ? (
              <CheckboxSkeleton items={3} />
            ) : allRoles.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-gray-400">No hay roles registrados</div>
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
          <Checkbox label="Activo" checked={active} onChange={(checked) => setActive(checked)} size="md" />
        </div>
        {error && <p className="text-error-500 text-sm">{error}</p>}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </>
  );
}
