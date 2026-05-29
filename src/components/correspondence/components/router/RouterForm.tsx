import { useEffect, useState } from 'react';
import { Document } from '../../types/documents/document.type.ts';
import { CreateRouterRequest } from '../../types/routers/router.type.ts';

import Label from '../../../form/Label.tsx';
import InputField from '../../../form/input/InputField.tsx';
import TextArea from '../../../form/input/TextArea.tsx';
import Button from '../../../ui/button/Button.tsx';

import Select, { Option } from '../../../form/Select.tsx';
import { InfoIcon } from '../../../../icons';
import Tooltip from '../../../form/Tooltip.tsx';
import { useFormValidation } from '../../../../hooks/useFormValidation.ts';

import { useNotifications } from '../../../../hooks/useNotification.tsx';

import { getDepartments } from '../../services/department.service.ts';
import { getProcedures } from '../../services/procedure.service.ts';
import { getStateDocuments } from '../../services/state-document.service.ts';
import { getProvides } from '../../services/provided.service.ts';
import { getUsersByDepartment } from '../../../../services/admin/users.service.ts';
import { getTypeDocuments } from '../../services/type-document.service.ts';
import { getPriorities } from '../../services/priority.service.ts';

interface RouterFormProps {
  document: Document;
  onSubmit: (data: CreateRouterRequest) => Promise<void>;
  onCancel: () => void;
}

function mapToOptions<T>(items: T[], valueKey: keyof T, labelKey: keyof T): Option[] {
  return items.map((item) => ({
    value: String(item[valueKey]),
    label: String(item[labelKey]),
  }));
}

export default function RouterForm({ document, onSubmit, onCancel }: RouterFormProps) {
  const { values, errors, setValue, setMultipleErrors } = useFormValidation({
    selectedDepartmentOrigen: '',
    selectedProcedureType: String(document.procedure_id ?? ''),
    selectedPriority: String(document.priority_id ?? ''),
    selectedDepartment: String(document.department_id ?? ''),
    selectedTypeDocument: String(document.type_document_id ?? ''),
    docFechaOrigen: document.doc_fecha_origen ?? '',
    docCite: document.doc_cite ?? '',
    docNumeroCite: document.doc_numero_cite ?? '',
    docRemite: document.doc_remite ?? '',
    docReferencia: document.doc_referencia ?? '',
    docAnexos: document.doc_anexos ?? '',
    docFojas: document.doc_fojas?.toString() ?? '',

    selectedDepartmentDestino: '',
    selectedUserDestino: '',
    selectedStateDocument: '',

    routAclaracionProveido: '',
    routObservacion: '',

    providedIds: [] as string[],
  });

  const { addNotification } = useNotifications();

  const [departments, setDepartments] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [procedures, setProcedures] = useState<Option[]>([]);
  const [stateDocuments, setStateDocuments] = useState<Option[]>([]);
  const [typeDocuments, setTypeDocuments] = useState<Option[]>([]);
  const [priorities, setPriorities] = useState<Option[]>([]);

  const [provides, setProvides] = useState<Option[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCatalogs() {
      try {
        setLoadingCatalogs(true);
        const [departmentsData, typeDocumentsData, prioritiesData, proceduresData, statesData, providesData] =
          await Promise.all([
            getDepartments(),
            getTypeDocuments(),
            getPriorities(),
            getProcedures(),
            getStateDocuments(),
            getProvides(),
          ]);

        setDepartments(mapToOptions(departmentsData, 'id', 'dep_name'));
        setTypeDocuments(mapToOptions(typeDocumentsData, 'id', 'typ_name'));
        setPriorities(
          prioritiesData.map((item) => ({
            value: String(item.id),
            label: String(item.pri_name)
              .replace(/<[^>]*>/g, '')
              .trim(),
          })),
        );
        setProcedures(mapToOptions(proceduresData, 'id', 'proc_name'));

        setStateDocuments(mapToOptions(statesData, 'id', 'sdoc_name'));

        setProvides(mapToOptions(providesData, 'id', 'prov_name'));
      } catch {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudieron cargar los catálogos',
        });
      } finally {
        setLoadingCatalogs(false);
      }
    }

    loadCatalogs();
  }, []);

  useEffect(() => {
    async function loadUsers() {
      if (!values.selectedDepartmentDestino) {
        setUsers([]);
        return;
      }

      try {
        const usersData = await getUsersByDepartment(Number(values.selectedDepartmentDestino));
        setUsers(mapToOptions(usersData, 'id', 'full_name'));
      } catch {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudieron cargar los usuarios',
        });
      }
    }

    loadUsers();
  }, [values.selectedDepartmentDestino]);

  function handleProvidedChange(value: string) {
    const exists = values.providedIds.includes(value);
    if (exists) {
      setValue(
        'providedIds',
        values.providedIds.filter((item: string) => item !== value),
      );
    } else {
      setValue('providedIds', [...values.providedIds, value]);
    }
  }

  function validate(): boolean {
    const newErrors: any = {};
    if (!values.selectedDepartmentOrigen)
      newErrors.selectedDepartmentOrigen = 'Debe seleccionar un departamento origen';
    if (!values.selectedDepartmentDestino)
      newErrors.selectedDepartmentDestino = 'Debe seleccionar un departamento destino';
    if (!values.selectedUserDestino) newErrors.selectedUserDestino = 'Debe seleccionar un usuario destino';
    if (!values.selectedStateDocument) newErrors.selectedStateDocument = 'Debe seleccionar un estado';
    if (!values.selectedProcedureType) newErrors.selectedProcedureType = 'Debe seleccionar un trámite';
    if (values.providedIds.length === 0) newErrors.providedIds = 'Debe seleccionar al menos un proveído';

    setMultipleErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const payload: CreateRouterRequest = {
        document_id: document.id,
        department_id_destino: Number(values.selectedDepartmentDestino),
        user_id_destino: values.selectedUserDestino ? Number(values.selectedUserDestino) : undefined,
        procedure_id: values.selectedProcedureType ? Number(values.selectedProcedureType) : undefined,
        state_document_id: Number(values.selectedStateDocument),
        provided_ids: values.providedIds,
        rout_aclaracion_proveido: values.routAclaracionProveido.trim(),
        rout_observacion: values.routObservacion.trim(),
      };
      await onSubmit(payload);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      addNotification({
        type: 'error',
        title: 'Error',
        message: axiosErr?.response?.data?.message ?? 'Error al derivar documento',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <Label>
          Departamento origen<span className="text-error-500">*</span>
        </Label>
        <Select
          options={departments}
          value={values.selectedDepartmentOrigen}
          loading={loadingCatalogs}
          onChange={(value) => {
            setValue('selectedDepartmentOrigen', value);
          }}
          placeholder="Seleccione departamento"
          error={!!errors.selectedDepartmentOrigen}
          hint={errors.selectedDepartmentOrigen}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <Label>
            Tipo de Trámite<span className="text-error-500">*</span>
          </Label>
          <Select
            options={procedures}
            value={values.selectedProcedureType}
            loading={loadingCatalogs}
            onChange={(value) => setValue('selectedProcedureType', value)}
            placeholder="Seleccione un trámite"
            error={!!errors.selectedProcedureType}
            hint={errors.selectedProcedureType}
          />
        </div>
        <div>
          <Label>
            Tipo de Documento<span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Tipo de Documento:</p>
                  <p className="mb-2 font-medium">
                    Se debe seleccionar el tipo de documento que se adjunta a la hora de tramite.
                  </p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <Select
            options={typeDocuments}
            defaultValue={values.selectedTypeDocument}
            loading={loadingCatalogs}
            onChange={(value) => setValue('selectedTypeDocument', value)}
            placeholder="Seleccione un documento"
            error={!!errors.selectedTypeDocument}
            hint={errors.selectedTypeDocument}
          />
        </div>

        <div>
          <Label>
            Prioridad<span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Prioridad:</p>
                  <p className="mb-2 font-medium">
                    Se debe seleccionar la prioridad con la que se debe atender este documento.
                  </p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <Select
            options={priorities}
            defaultValue={values.selectedPriority}
            loading={loadingCatalogs}
            onChange={(value) => setValue('selectedPriority', value)}
            placeholder="Seleccione prioridad"
            error={!!errors.selectedPriority}
            hint={errors.selectedPriority}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <Label>Cite</Label>
          <InputField value={values.docCite} disabled />
        </div>
        <div>
          <Label>Nro. Cite</Label>
          <InputField value={values.docNumeroCite} disabled />
        </div>
        <div>
          <Label>Remite</Label>
          <InputField value={values.docRemite} disabled />
        </div>

        <div>
          <Label>Anexos</Label>
          <InputField value={values.docAnexos} disabled />
        </div>

        <div>
          <Label>Fojas</Label>
          <InputField value={values.docFojas} disabled />
        </div>

        <div>
          <Label>Fecha Documento</Label>
          <InputField value={values.docFechaOrigen} disabled />
        </div>
      </div>

      <div className="mt-5">
        <Label>Referencia</Label>
        <TextArea rows={4} value={values.docReferencia} disabled />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Datos de Derivación</h3>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <Label>
              Estado Documento<span className="text-error-500">*</span>
            </Label>
            <Select
              options={stateDocuments}
              value={values.selectedStateDocument}
              loading={loadingCatalogs}
              onChange={(value) => setValue('selectedStateDocument', value)}
              placeholder="Seleccione estado"
              error={!!errors.selectedStateDocument}
              hint={errors.selectedStateDocument}
            />
          </div>
          <div>
            <Label>
              Departamento Destino<span className="text-error-500">*</span>
            </Label>
            <Select
              options={departments}
              value={values.selectedDepartmentDestino}
              loading={loadingCatalogs}
              onChange={(value) => {
                setValue('selectedDepartmentDestino', value);
                setValue('selectedUserDestino', '');
              }}
              placeholder="Seleccione departamento"
              error={!!errors.selectedDepartmentDestino}
              hint={errors.selectedDepartmentDestino}
            />
          </div>

          <div>
            <Label>
              Usuario Destino<span className="text-error-500">*</span>
            </Label>
            <Select
              options={users}
              value={values.selectedUserDestino}
              loading={loadingCatalogs}
              onChange={(value) => setValue('selectedUserDestino', value)}
              placeholder="Seleccione usuario"
              error={!!errors.selectedUserDestino}
              hint={errors.selectedUserDestino}
            />
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* PROVEIDOS */}
      {/* ========================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Proveídos</h3>

          <Tooltip content={<div>Seleccione las acciones correspondientes para la derivación.</div>}>
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {provides.map((item) => {
            const checked = values.providedIds.includes(item.value);

            return (
              <label
                key={item.value}
                className="hover:border-brand-300 dark:hover:border-brand-700 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 transition-colors dark:border-gray-700"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleProvidedChange(item.value)}
                  className="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900"
                />

                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              </label>
            );
          })}
        </div>

        {errors.providedIds && <p className="text-error-500 mt-2 text-sm">{errors.providedIds}</p>}
      </div>

      {/* ========================= */}
      {/* OBSERVACIONES */}
      {/* ========================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Observaciones</h3>

        <div className="space-y-5">
          <div>
            <Label>Aclaración del Proveído</Label>

            <TextArea
              rows={5}
              value={values.routAclaracionProveido}
              onChange={(value) => setValue('routAclaracionProveido', value)}
              placeholder="Ingrese una aclaración"
            />
          </div>

          <div>
            <Label>Observación</Label>

            <TextArea
              rows={5}
              value={values.routObservacion}
              onChange={(value) => setValue('routObservacion', value)}
              placeholder="Ingrese una observación"
            />
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* ACTIONS */}
      {/* ========================= */}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Derivando...' : 'Derivar'}
        </Button>
      </div>
    </form>
  );
}
