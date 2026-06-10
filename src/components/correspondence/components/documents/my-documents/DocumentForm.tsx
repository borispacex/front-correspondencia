import { useEffect, useState } from 'react';
import { Document } from '../../../types/documents/document.type.ts';
import { useFormValidation } from '../../../../../hooks/useFormValidation.ts';
import { CreateRouterRequest } from '../../../types/routers/router.type.ts';
import Select, { Option } from '../../../../form/Select.tsx';
import { useNotifications } from '../../../../../hooks/useNotification.tsx';
import { getDepartments } from '../../../services/items/department.service.ts';
import { getTypeDocuments } from '../../../services/items/type-document.service.ts';
import { getPriorities } from '../../../services/items/priority.service.ts';
import { getProcedures } from '../../../services/items/procedure.service.ts';
import { getStateDocuments } from '../../../services/items/state-document.service.ts';
import { getProvides } from '../../../services/items/provided.service.ts';
import { getUsersByDepartment } from '../../../../../services/admin/users.service.ts';
import Label from '../../../../form/Label.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import { InfoIcon } from '../../../../../icons';
import InputField from '../../../../form/input/InputField.tsx';
import TextArea from '../../../../form/input/TextArea.tsx';
import MultiSelect from '../../../../form/MultiSelect.tsx';
import CheckboxSkeleton from '../../../../animation/CheckboxSkeleton.tsx';
import Checkbox from '../../../../form/input/Checkbox.tsx';
import RichTextEditor from '../../../../form/RichTextEditor.tsx';
import DropZonePdf from '../../../../form/form-elements/DropZonePdf.tsx';
import Button from '../../../../ui/button/Button.tsx';

interface Props {
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

export default function DocumentForm({ document, onSubmit, onCancel }: Props) {
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

    file: null as File | null,
  });

  const { addNotification } = useNotifications();

  const [departments, setDepartments] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [procedures, setProcedures] = useState<Option[]>([]);
  const [stateDocuments, setStateDocuments] = useState<Option[]>([]);
  const [typeDocuments, setTypeDocuments] = useState<Option[]>([]);
  const [priorities, setPriorities] = useState<Option[]>([]);

  const [provides, setProvides] = useState<Option[]>([]);
  const [selectedProvideIds, setSelectedProvideIds] = useState<string[]>([]);
  const [selectedDepartmentsIds, setSelectedDepartmentsIds] = useState<string[]>([]);
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
        setUsers(mapToOptions(usersData, 'id', 'name'));
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
    if (!values.file) newErrors.file = 'El archivo es requerido';

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

  function toggleProvide(id: string) {
    setSelectedProvideIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <Label>
          Departamento origen<span className="text-error-500">*</span>{' '}
          <Tooltip
            content={
              <div>
                <p className="mb-2 font-bold">Departamento origen:</p>
                <p className="mb-2 font-medium">Se debera seleccionar el area funcional a la que pertenece.</p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
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
            Estado del documento<span className="text-error-500">*</span>
          </Label>
          <Select
            options={stateDocuments}
            value={values.selectedStateDocument}
            loading={loadingCatalogs}
            onChange={(value) => setValue('selectedStateDocument', value)}
            placeholder="Seleccione un estado"
            error={!!errors.selectedStateDocument}
            hint={errors.selectedStateDocument}
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
                    Se debe seleccionar el tipo de documento que se adjunta a la hora de trámite.
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
          <Label>
            Cite<span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Cite:</p>
                  <p className="mb-2 font-medium">
                    Es la coficacion que genra la reparticion, division, areas funcionales, etc. para su control.
                  </p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <InputField
            value={values.docCite}
            onChange={(e) => setValue('docCite', e.target.value)}
            placeholder="Cite"
            error={!!errors.docCite}
            hint={errors.docCite}
            disabled
          />
        </div>
        <div>
          <Label>
            Nro. Cite<span className="text-error-500">*</span>
          </Label>
          <InputField
            value={values.docNumeroCite}
            onChange={(e) => setValue('docNumeroCite', e.target.value)}
            placeholder="Nro. Cite"
            error={!!errors.docNumeroCite}
            hint={errors.docNumeroCite}
            disabled
          />
        </div>
        <div>
          <Label>
            Remite
            <span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Remite:</p>
                  <p className="mb-2 font-medium">
                    La persona encargada del área funcional quien está enviando la hoja de trámite.
                  </p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <InputField
            value={values.docRemite}
            onChange={(e) => setValue('docRemite', e.target.value)}
            placeholder="Remitente"
            error={!!errors.docRemite}
            hint={errors.docRemite}
            disabled
          />
        </div>
      </div>

      <div>
        <Label>
          Objeto / Referencia
          <span className="text-error-500">*</span>{' '}
          <Tooltip
            content={
              <div>
                <p className="mb-2 font-bold">Objeto / Referencia:</p>
                <p className="mb-2 font-medium">
                  Se debe colocar el objeto del documento que se adjunta a la hoja de trámite.
                </p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Label>
        <TextArea
          rows={4}
          value={values.docReferencia}
          onChange={(value) => setValue('docReferencia', value)}
          placeholder="Referencia"
          error={!!errors.docReferencia}
          hint={errors.docReferencia}
        />
      </div>
      <div>
        <Label>
          Departamentos
          <span className="text-error-500">*</span>{' '}
          <Tooltip
            content={
              <div>
                <p className="mb-2 font-bold">Departamentos:</p>
                <p className="mb-2 font-medium">
                  Se debe seleccionar una o mas departamentos a los que se derivara la hoja de trámite.
                </p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Label>
        <div>
          <MultiSelect
            required
            selectAll
            searchable
            value={selectedDepartmentsIds}
            loading={loadingCatalogs}
            rules={[
              { type: 'required', message: 'Selecciona al menos una opción.' },
              { type: 'min', value: 2, message: 'Mínimo 2 opciones.' },
            ]}
            options={departments}
            onChange={(vals) => setSelectedDepartmentsIds(vals)}
          />
        </div>
      </div>

      <div>
        <Label>
          Proveidos
          <span className="text-error-500">*</span>{' '}
          <Tooltip
            content={
              <div>
                <p className="mb-2 font-bold">Proveidos:</p>
                <p className="mb-2 font-medium">Se debe seleccionar uno o mas proveidos a la hoja de trámite.</p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Label>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
          {loadingCatalogs ? (
            <CheckboxSkeleton items={4} />
          ) : provides.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">No hay proveidos registrados</div>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {provides.map((provide) => (
                <Checkbox
                  key={provide.value}
                  label={provide.label}
                  checked={selectedProvideIds.includes(provide.value)}
                  onChange={() => toggleProvide(provide.value)}
                  size="md"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <Label>
          Aclaracion del proveido
          <span className="text-error-500">*</span>{' '}
          <Tooltip
            content={
              <div>
                <p className="mb-2 font-bold">Aclaracion del proveido:</p>
                <p className="mb-2 font-medium">
                  Se debera colocar una aclaracion al o los provedios que se marquen para su mejor comprension.
                </p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Label>
        <RichTextEditor
          label="Aclaración del Proveído"
          name="routAclaracionProveido"
          value={values.routAclaracionProveido}
          // onChange={(html) => setFormData(p => ({ ...p, routAclaracionProveido: html }))}
          onChange={(html) => setValue('routAclaracionProveido', html)}
          minHeight={160}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <Label>
            Anexos
            <span className="text-error-500">*</span>
          </Label>
          <InputField
            value={values.docAnexos}
            onChange={(e) => setValue('docAnexos', e.target.value)}
            placeholder="Anexos"
            error={!!errors.docAnexos}
            hint={errors.docAnexos}
          />
        </div>
        <div>
          <Label>
            Fojas
            <span className="text-error-500">*</span>
          </Label>
          <InputField
            type="number"
            value={values.docFojas}
            onChange={(e) => setValue('docFojas', e.target.value)}
            placeholder="0"
            min="0"
            error={!!errors.docFojas}
            hint={errors.docFojas}
          />
        </div>
      </div>

      <div>
        <Label>
          Archivo
          <span className="text-error-500">*</span>{' '}
          <Tooltip
            content={
              <div>
                <p className="mb-2 font-bold">Archivo:</p>
                <p className="mb-2 font-medium">Se debe adjuntar el archivo en formato PDF.</p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Label>

        <DropZonePdf
          size="sm"
          value={values.file}
          onChange={(value) => setValue('file', value)}
          maxSizeMB={10}
          error={!!errors.file}
          hint={errors.file}
          required
        />
        {document?.doc_url && !values.file && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Archivo actual:{' '}
            <a href={document.doc_url} target="_blank" rel="noopener noreferrer" className="text-brand-500 underline">
              ver archivo
            </a>
          </p>
        )}
      </div>

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
