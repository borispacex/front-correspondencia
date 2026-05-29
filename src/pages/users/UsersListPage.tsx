import { useState, useEffect, useCallback } from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { Modal } from '../../components/ui/modal';
import UserTable from '../../components/users/UserTable';
import UserForm from '../../components/users/UserForm';
import { PlusIcon } from '../../icons';

import { getUsers, createUser, updateUser, deleteUser } from '../../services/admin/users.service.ts';

import type { User, CreateUserRequest, UpdateUserRequest } from '../../types/admin/users/user.types';

import { usePermissions } from '../../hooks/usePermissions';
import { useNotifications } from '../../hooks/useNotification';

import Button from '../../components/ui/button/Button.tsx';
import ModalDelete from '../../components/modal/ModalDelete.tsx';
import ModalStatus from '../../components/modal/ModalStatus.tsx';

export default function UsersListPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState<User | null>(null);
  const [nextStatus, setNextStatus] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  function handleEdit(user: User) {
    setSelected(user);
    setIsModalOpen(true);
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function handleConfirmDelete() {
    if (confirmId === null) return;

    try {
      await deleteUser(confirmId);

      addNotification({
        type: 'success',
        title: 'Usuario eliminado',
        message: 'El usuario fue eliminado correctamente.',
      });

      setConfirmId(null);
      fetchUsers();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al eliminar el usuario',
      });
    }
  }

  async function handleSubmit(data: CreateUserRequest | UpdateUserRequest) {
    try {
      if (selected) {
        await updateUser(selected.id, data as UpdateUserRequest);

        addNotification({
          type: 'info',
          title: 'Usuario actualizado',
          message: `El usuario "${data.name}" fue actualizado correctamente.`,
        });
      } else {
        await createUser(data as CreateUserRequest);

        addNotification({
          type: 'success',
          title: 'Usuario creado',
          message: `El usuario "${data.name}" fue creado correctamente.`,
        });
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al guardar el usuario',
      });
    }
  }

  function handleToggleActive(item: User, active: boolean) {
    setSelectedStatusItem(item);
    setNextStatus(active);
    setOpenStatusModal(true);
  }

  async function handleChangeStatus() {
    if (!selectedStatusItem) return;

    setLoadingStatus(true);

    try {
      await updateUser(selectedStatusItem.id, {
        active: nextStatus,
      });

      addNotification({
        type: 'success',
        title: 'Estado actualizado',
        message: `El usuario fue ${nextStatus ? 'activado' : 'desactivado'} correctamente.`,
      });

      setOpenStatusModal(false);
      setSelectedStatusItem(null);
      fetchUsers();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al cambiar el estado del usuario',
      });
    } finally {
      setLoadingStatus(false);
    }
  }

  return (
    <>
      <PageMeta title="Usuarios" description="Gestión de usuarios del sistema" />
      <PageBreadCrumb pageTitle="Usuarios" />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Lista de Usuarios</h2>

          {can('users.create') && (
            <Button size="sm" onClick={handleCreate} startIcon={<PlusIcon className="size-4 text-white" />}>
              Nuevo Usuario
            </Button>
          )}
        </div>

        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6 sm:p-8">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {selected ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h3>
        <p className="mb-5 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
        </p>
        <UserForm user={selected} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ModalStatus
        isOpen={openStatusModal}
        active={nextStatus}
        onClose={() => {
          setOpenStatusModal(false);
          setSelectedStatusItem(null);
        }}
        onConfirm={handleChangeStatus}
        loading={loadingStatus}
      />

      <ModalDelete
        isOpen={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este usuario?"
        message="Esta acción no se puede deshacer."
      />
    </>
  );
}
