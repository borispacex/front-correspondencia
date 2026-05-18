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
  deleteMenuItem,
  getMenuItemsAll,
} from "../../services/menu-items.service";
import type { MenuItem, CreateMenuItemRequest } from "../../types/menu-items/menu-item.types";
import { useMenu } from "../../hooks/useMenu";
import { usePermissions } from "../../hooks/usePermissions";
import ModalDelete from "../../components/modal/ModalDelete.tsx";
import Button from "../../components/ui/button/Button.tsx";

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
  const [rawMenuItems, setRawMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => { loadAll(); }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [selected, setSelected] = useState<MenuItem | null>(null);

  function handleCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  function handleEdit(item: MenuItem) {
    setSelected(item);
    setIsModalOpen(true);
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function handleConfirmDelete() {
    if (confirmId === null) return;
    await deleteMenuItem(confirmId);
    setConfirmId(null);
    await refreshMenu();
    await loadAll();
  }

  async function handleSubmit(data: CreateMenuItemRequest) {
    if (selected) {
      await updateMenuItem(selected.id, { id: selected.id, ...data });
    } else {
      await createMenuItem(data);
    }
    setIsModalOpen(false);
    await refreshMenu();
    await loadAll();
  }

  return (
    <>
      <PageMeta title="Ítems de Menú" description="Gestión de ítems del menú" />
      <PageBreadCrumb pageTitle="Ítems de Menú" />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Lista de Ítems de Menú
          </h2>
          {can('menu_items.create') && (
              <Button
                  size={"sm"}
                  onClick={handleCreate}
                  startIcon={<PlusIcon className="size-4 text-white" />}
              >
                Nuevo Ítem
              </Button>
          )}
        </div>

        <MenuItemTable menuItems={menuItems} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

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
