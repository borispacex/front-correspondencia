import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../hooks/auth/useAuth";
import {PencilIcon} from "../../icons";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth();
  const handleSave = () => {
    // Handle save logic here
    console.log("Guardando cambios...");
    closeModal();
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Datos personales
          </h4>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nombres
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.name?.split(" ")[0] ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Apellido paterno
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.last_name?.split(" ").slice(1).join(" ") || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Apellido materno
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.mother_last_name?.split(" ").slice(1).join(" ") || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                CI
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.ci?.split(" ").slice(1).join(" ") || "—"}
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
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <PencilIcon
              width="18"
              height="18"
              className="fill-current"
          />
          Editar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar información personal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus datos para mantener tu perfil al día.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="max-h-[70vh] overflow-y-auto px-2 pb-3 pr-2 custom-scrollbar">

              <div className="mt-1">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Datos personales
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
                    <Label>CI</Label>
                    <Input type="text" value="9884972" disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Correo Electronico</Label>
                    <Input type="text" value="randomuser@pimjo.com" disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Teléfono</Label>
                    <Input type="text" value="60514138" />
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
    </div>
  );
}
