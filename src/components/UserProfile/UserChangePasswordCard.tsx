import { Modal } from "../ui/modal";
import {PencilIcon} from "../../icons";
import UserChangePasswordForm from "./UserChangePasswordForm.tsx";
import type {ChangePasswordUserRequest} from "../../types/users/user.types.ts";
import {useNotifications} from "../../hooks/useNotification.tsx";
import {useState} from "react";
import {changePasswordUser} from "../../services/users-profile.service.ts";
import {useAuth} from "../../hooks/auth/useAuth.ts";
import {formatDateBo} from "../../utils/format.utils.ts";

export default function UserChangePasswordCard() {
  const { user, refreshUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  async function handleSubmit(data: ChangePasswordUserRequest) {
    try {
        await changePasswordUser(data as ChangePasswordUserRequest);

        addNotification({
          type: "success",
          title: "Usuario actualizado",
          message: `Contraseña actualizada correctamente.`,
        });
      setIsModalOpen(false);
      await refreshUser();

    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message:
            err?.response?.data?.message ??
            "Error al cambiar contraseña",
      });
    }
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Seguridad
            </h4>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Contraseña
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {'*********'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ultimo cambio contraseña
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDateBo(user?.UltimoCambioContrasenia ?? user?.created_at)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Fecha de actualiación
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDateBo(user?.updated_at ?? user?.created_at)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Fecha de creación
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDateBo(user?.created_at)}
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
            Cambiar contraseña
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6 sm:p-8">
          <div >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Cambiar contraseña
            </h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
            </p>
          </div>
          <UserChangePasswordForm user={user} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
