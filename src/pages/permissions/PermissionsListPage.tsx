import { useState, useEffect, useCallback } from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { Modal } from '../../components/ui/modal';
import PermissionTable from '../../components/permissions/PermissionTable';
import PermissionForm from '../../components/permissions/PermissionForm';
import { PlusIcon } from '../../icons';

import { getPermissions, deletePermission } from '../../services/admin/permissions.service.ts';

import type { Permission } from '../../types/admin/permissions/permission.types';

import { usePermissions } from '../../hooks/usePermissions';

import Button from '../../components/ui/button/Button.tsx';
import ModalDelete from '../../components/modal/ModalDelete.tsx';
import { useNotifications } from '../../hooks/useNotification.tsx';

export default function PermissionsListPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Permission | null>(null);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getPermissions();
      setPermissions(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  function handleCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  function handleEdit(permission: Permission) {
    setSelected(permission);
    setIsModalOpen(true);
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function handleConfirmDelete() {
    if (confirmId === null) return;

    try {
      setIsDeleting(true);

      await deletePermission(confirmId);

      addNotification({
        type: 'success',
        title: 'Permiso eliminado',
        message: 'El permiso fue eliminado correctamente.',
      });

      fetchPermissions();
    } catch {
      addNotification({
        type: 'error',
        title: 'Error al eliminar',
        message: 'No se pudo eliminar el permiso.',
      });
    } finally {
      setIsDeleting(false);
      setConfirmId(null);
    }
  }

  return (
    <>
      <PageMeta title="Permisos" description="Gestión de permisos del sistema" />

      <PageBreadCrumb pageTitle="Permisos" />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Lista de Permisos</h2>

          {can('permissions.create') && (
            <Button size="sm" onClick={handleCreate} startIcon={<PlusIcon className="size-4 text-white" />}>
              Nuevo Permiso
            </Button>
          )}
        </div>

        <PermissionTable permissions={permissions} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6 sm:p-8">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {selected ? 'Editar Permiso' : 'Nuevo Permiso'}
        </h3>
        <p className="mb-5 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
        </p>
        <PermissionForm
          permission={selected}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPermissions();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ModalDelete
        isOpen={confirmId !== null}
        loading={isDeleting}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este permiso?"
        message="Esta acción no se puede deshacer."
      />
    </>
  );
}
