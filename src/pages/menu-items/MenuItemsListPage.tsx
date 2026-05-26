import { useState, useEffect } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import MenuItemTable from "../../components/menu-items/MenuItemTable";
import MenuItemForm from "../../components/menu-items/MenuItemForm";
import { PlusIcon } from "../../icons";

import {
  createMenuItem,
  updateMenuItem,
  getMenuItemsAll,
  deleteMenuItem,
  getMenuItemById,
} from "../../services/admin/menu-items.service.ts";

import type {
  MenuItem,
  CreateMenuItemRequest,
} from "../../types/menu-items/menu-item.types";

import { useMenu } from "../../hooks/useMenu";
import { usePermissions } from "../../hooks/usePermissions";
import { useNotifications } from "../../hooks/useNotification";

import Button from "../../components/ui/button/Button.tsx";
import ModalStatus from "../../components/modal/ModalStatus.tsx";
import ModalDelete from "../../components/modal/ModalDelete.tsx";

function flattenMenuItems(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  const visited = new Set<number>();

  function walk(nodes: MenuItem[]) {
    for (const item of nodes) {
      if (visited.has(item.id)) continue;

      visited.add(item.id);
      result.push(item);

      if (item.children?.length) {
        walk(item.children);
      }
    }
  }

  walk(items);
  return result;
}

export default function MenuItemsListPage() {
  const { refreshMenu } = useMenu();
  const { can } = usePermissions();
  const { addNotification } = useNotifications();

  const [rawMenuItems, setRawMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState<MenuItem | null>(null);
  const [nextStatus, setNextStatus] = useState(false);

  const menuItems = flattenMenuItems(rawMenuItems);

  async function loadAll() {
    setIsLoading(true);
    try {
      const data = await getMenuItemsAll();
      setRawMenuItems(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  async function handleEdit(item: MenuItem) {
    const fullItem = await getMenuItemById(item.id);
    setSelected(fullItem);
    setIsModalOpen(true);
  }

  function handleToggleActive(item: MenuItem, active: boolean) {
    setSelectedStatusItem(item);
    setNextStatus(active);
    setOpenStatusModal(true);
  }

  async function handleChangeStatus() {
    if (!selectedStatusItem) return;

    setLoadingStatus(true);

    try {
      await updateMenuItem(selectedStatusItem.id, {
        active: nextStatus,
      });

      addNotification({
        type: "success",
        title: "Estado actualizado",
        message: `El ítem fue ${
            nextStatus ? "activado" : "desactivado"
        } correctamente.`,
      });

      setOpenStatusModal(false);
      setSelectedStatusItem(null);

      await refreshMenu();
      await loadAll();
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message:
            err?.response?.data?.message ??
            "Error al cambiar el estado del ítem",
      });
    } finally {
      setLoadingStatus(false);
    }
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function handleConfirmDelete() {
    if (confirmId === null) return;

    try {
      await deleteMenuItem(confirmId);

      addNotification({
        type: "success",
        title: "Ítem eliminado",
        message: "El ítem de menú fue eliminado correctamente.",
      });

      setConfirmId(null);
      await refreshMenu();
      await loadAll();
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message:
            err?.response?.data?.message ??
            "Error al eliminar el ítem de menú",
      });
    }
  }

  async function handleSubmit(data: CreateMenuItemRequest) {
    try {
      if (selected) {
        await updateMenuItem(selected.id, {
          id: selected.id,
          ...data,
        });

        addNotification({
          type: "info",
          title: "Ítem actualizado",
          message: `El ítem "${data.label}" fue actualizado correctamente.`,
        });
      } else {
        await createMenuItem(data);

        addNotification({
          type: "success",
          title: "Ítem creado",
          message: `El ítem "${data.label}" fue creado correctamente.`,
        });
      }

      setIsModalOpen(false);
      await refreshMenu();
      await loadAll();
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message:
            err?.response?.data?.message ??
            "Error al guardar el ítem de menú",
      });
    }
  }

  return (
      <>
        <PageMeta
            title="Ítems de Menú"
            description="Gestión de ítems del menú"
        />

        <PageBreadCrumb pageTitle="Ítems de Menú" />

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Ítems de Menú
            </h2>

            {can("menu_items.create") && (
                <Button
                    size="sm"
                    onClick={handleCreate}
                    startIcon={<PlusIcon className="size-4 text-white" />}
                >
                  Nuevo Ítem
                </Button>
            )}
          </div>

          <MenuItemTable
              menuItems={menuItems}
              isLoading={isLoading}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
          />
        </div>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="max-w-lg p-6 sm:p-8"
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            {selected ? "Editar Ítem de Menú" : "Nuevo Ítem de Menú"}
          </h3>

          <MenuItemForm
              item={selected}
              allItems={menuItems}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
          />
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
            title="¿Eliminar este ítem de menú?"
            message="Esta acción no se puede deshacer."
        />
      </>
  );
}