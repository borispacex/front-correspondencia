import { useState, useEffect } from "react";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types/admin/users/user.types";
import type { Role } from "../../types/admin/roles/role.types";
import { getRoles } from "../../services/admin/roles.service.ts";
import Label from "../form/Label";
import InputField from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox.tsx";
import Button from "../ui/button/Button.tsx";
import CheckboxSkeleton from "../animation/CheckboxSkeleton.tsx";
import {InputFieldPassword} from "../form/input/InputFieldPassword.tsx";
import SearchSelect from "../form/SearchSelect.tsx";
import {searchUsuariosSaga} from "../../services/saga/users-saga.service.ts";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [ci, setCi] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [motherLastname, setMotherLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    setLoadingRoles(true);

    getRoles()
        .then((data) => setAllRoles(data))
        .catch(() => {})
        .finally(() => setLoadingRoles(false));
  }, []);

  useEffect(() => {
    setCi(user?.ci ?? "");
    setName(user?.name ?? "");
    setLastName(user?.last_name ?? "");
    setMotherLastName(user?.mother_last_name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setPassword("");
    setActive(user?.active ?? true);
    setPasswordConfirmation("");
    setError(null);
    if (user?.roles && allRoles.length > 0) {
      const matched = allRoles.filter((r) => user.roles!.some(ur => ur.name === r.name)).map((r) => r.id);
      setSelectedRoleIds(matched);
    } else {
      setSelectedRoleIds([]);
    }
  }, [user, allRoles]);

  useEffect(() => {
    if (!user) {
      setPassword(ci);
      setPasswordConfirmation(ci);
    }
  }, [ci, user]);

  function toggleRole(id: number) {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ci.trim()) {
      setError("Ci es requerido");
      return;
    }
    if (!name.trim() || !lastName.trim() || !motherLastname.trim()) {
      setError("Nombre, Apellido paterno y materno son requeridos");
      return;
    }
    if (!email.trim() || !phone.trim()) {
      setError("Nombre y correo y telefono son requeridos");
      return;
    }
    if (!user && !password) {
      setError("La contraseña es requerida para crear un usuario");
      return;
    }
    if (password && password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      if (user) {
        const payload: UpdateUserRequest = {
          id: user.id,
          ci: user.ci.trim(),
          name: name.trim(),
          last_name: lastName.trim(),
          mother_last_name: motherLastname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          roles: selectedRoleIds,
          active: active,
        };
        if (password) {
          payload.password = password;
          payload.password_confirmation = passwordConfirmation;
        }
        await onSubmit(payload);
      } else {
        await onSubmit({
          ci: ci.trim(),
          name: name.trim(),
          last_name: lastName.trim(),
          mother_last_name: motherLastname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          password_confirmation: passwordConfirmation,
          roles: selectedRoleIds,
        });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? "Error al guardar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  }

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query: string) {
    try {
      setLoading(true);
      const data = await searchUsuariosSaga(query);
      setUsers(data);
    } finally {
      setLoading(false);
    }
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
                getOptionLabel={(user) =>
                    `${user.ci} - ${user.name} ${user.last_name} ${user.mother_last_name}`
                }
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>Ci <span className="text-error-500">*</span></Label>
              <InputField value={ci} onChange={(e) => setCi(e.target.value)} placeholder="9884972" />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Nombre(s) <span className="text-error-500">*</span></Label>
              <InputField value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>Apellido paterno <span className="text-error-500">*</span></Label>
              <InputField value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Perez" />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Apellido materno <span className="text-error-500">*</span></Label>
              <InputField value={motherLastname} onChange={(e) => setMotherLastName(e.target.value)} placeholder="Lopez" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>Correo electrónico <span className="text-error-500">*</span></Label>
              <InputField type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@adm.emi.edu.bo" />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Teléfono <span className="text-error-500">*</span></Label>
              <InputField value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="60514138" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>
                Contraseña
                <br/>
                <span className="text-xs text-gray-400 ml-1">{user ? '(Dejar en blanco para no cambiar)' : '(Recomendamos una contraseña segura)'}</span>
                <span className="text-error-500"> *</span>
              </Label>
              <InputFieldPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Confirmar contraseña
                <br/>
                <span className="text-xs text-gray-400 ml-1">{user ? '(Dejar en blanco para no cambiar)' : '(Las contraseñas deben coincidir)'}<span className="text-error-500"> *</span></span>
              </Label>
              <InputFieldPassword
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Label>Roles</Label>

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
          {error && <p className="text-sm text-error-500">{error}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
                type="submit"
                disabled={isSubmitting}
            >
              {isSubmitting
                  ? "Guardando..."
                  : user
                      ? "Actualizar"
                      : "Crear"}
            </Button>
          </div>
        </form>
      </>
  );
}
