import { useState, useEffect, useCallback } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import { PlusIcon } from "../../icons";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/users.service";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types/users/user.types";
import { usePermissions } from "../../hooks/usePermissions";
import Button from "../../components/ui/button/Button.tsx";
import ModalDelete from "../../components/modal/ModalDelete.tsx";

export default function UsersListPage() {
  const { can } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      // silent
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
    await deleteUser(confirmId);
    setConfirmId(null);
    fetchUsers();
  }

  async function handleSubmit(data: CreateUserRequest | UpdateUserRequest) {
    if (selected) {
      await updateUser(selected.id, data as UpdateUserRequest);
    } else {
      await createUser(data as CreateUserRequest);
    }
    setIsModalOpen(false);
    fetchUsers();
  }

  return (
    <>
      <PageMeta title="Usuarios" description="Gestión de usuarios del sistema" />
      <PageBreadCrumb pageTitle="Usuarios" />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Lista de Usuarios
          </h2>
          {can('users.create') && (
              <Button
                  size={"sm"}
                  onClick={handleCreate}
                  startIcon={<PlusIcon className="size-4 text-white" />}
              >
                Nuevo Usuario
              </Button>
          )}
        </div>

        <UserTable users={users} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-md p-6 sm:p-8"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {selected ? "Editar Usuario" : "Nuevo Usuario"}
        </h3>
        <UserForm
          user={selected}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

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
