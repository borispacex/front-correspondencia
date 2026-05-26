import { Modal } from "../ui/modal";
import { useAuth } from "../../hooks/auth/useAuth";
import {PencilIcon} from "../../icons";
import UserInfoForm from "./UserInfoForm.tsx";
import {useState} from "react";
import {useNotifications} from "../../hooks/useNotification.tsx";
import {infoUser} from "../../services/main/users-profile.service.ts";
import {InfoUserRequest} from "../../types/users/user.types.ts";

export default function UserInfoCard() {
  const { user, refreshUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  async function handleSubmit(data: InfoUserRequest) {
    try {
      await infoUser(data as InfoUserRequest);

      addNotification({
        type: "success",
        title: "Usuario actualizado",
        message: `Usuario actualizado correctamente.`,
      });
      setIsModalOpen(false);
      await refreshUser();

    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message:
            err?.response?.data?.message ??
            "Error al actualizar usuario",
      });
    }
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Datos personales
          </h4>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                CI
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.ci ?? "—"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nombres
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.name ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Apellido paterno
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.last_name ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Apellido materno
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.mother_last_name ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Correo electrónico
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Teléfono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.phone ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <PencilIcon
              width="18"
              height="18"
              className="fill-current"
          />
          Cambiar información
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6 sm:p-8">
        <div >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Editar Información personal
          </h3>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
          </p>
        </div>
          <UserInfoForm user={user} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />

      </Modal>
    </div>
  );
}
