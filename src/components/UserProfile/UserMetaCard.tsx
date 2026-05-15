import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../hooks/auth/useAuth";
import {CameraIcon, PencilIcon} from "../../icons";
import {useState} from "react";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  const [previewImage, setPreviewImage] = useState(
      user?.foto
          ? `/storage/users/${user.foto}`
          : "/images/user/owner.jpg"
  );
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };
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
                  onClick={openModal}
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar perfil general
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus datos para mantener tu perfil al día.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="max-h-[70vh] overflow-y-auto px-2 pb-3 pr-2 custom-scrollbar">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                  Cambiar foto de perfil
                </h5>
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20">
                    <img
                        src={previewImage || "/images/user/owner.jpg"}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
                      <CameraIcon
                          className="fill-gray-700 dark:fill-gray-300"
                          width="16"
                          height="16"
                      />
                      <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sube una imagen cuadrada (200x200 píxeles).
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      en formato JPG o PNG.
                    </p>
                  </div>
                </div>

              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nombre(s)</Label>
                    <Input type="text" value="Musharof" disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Apellido paterno</Label>
                    <Input type="text" value="Chowdhury" disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Apellido materno</Label>
                    <Input type="text" value="Chowdhury" disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Correo electronico</Label>
                    <Input type="email" value="randomuser@pimjo.com" disabled />
                  </div>

                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                Actualizar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
