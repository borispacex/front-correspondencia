import { Modal } from "../ui/modal";
import { useAuth } from "../../hooks/auth/useAuth";
import {PencilIcon} from "../../icons";
import {useState} from "react";
import {useNotifications} from "../../hooks/useNotification.tsx";
import {PhotoUserRequest} from "../../types/users/user.types.ts";
import {photoUser} from "../../services/users-profile.service.ts";
import UserPhotoForm from "./UserPhotoForm.tsx";

export default function UserPhotoCard() {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const [previewImage, setPreviewImage] = useState(
      user?.foto
          ? `/storage/users/${user.foto}`
          : "/images/user/owner.jpg"
  );

  async function handleSubmit(data: PhotoUserRequest) {
    try {
      await photoUser(data as PhotoUserRequest);

      addNotification({
        type: "success",
        title: "Usuario actualizado",
        message: `Foto actualizada correctamente.`,
      });
      setIsModalOpen(true);

    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message:
            err?.response?.data?.message ??
            "Error al actualizar foto",
      });
    }
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                  src={previewImage || "/images/user/owner.jpg"}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <PencilIcon
                    width="18"
                    height="18"
                    className="text-gray-700 dark:text-gray-300"
                />
              </button>
            </div>


            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.name ? user.name.toUpperCase() : "—"} {user?.last_name ? user.last_name.toUpperCase() : ""} {user?.mother_last_name ? user.mother_last_name.toUpperCase() : ""}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6 sm:p-8">
          <div >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Cambiar foto de perfil
            </h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
            </p>
          </div>
          <UserPhotoForm user={user} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
