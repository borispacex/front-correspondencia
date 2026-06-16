import { useEffect, useState } from 'react';

import { CreateDocumentRequest, Document, UpdateDocumentRequest } from '../../../types/documents/document.type.ts';
import { useNotifications } from '../../../../../hooks/useNotification.tsx';
import Select, { Option } from '../../../../form/Select.tsx';
import { useFormValidation } from '../../../../../hooks/useFormValidation.ts';
import Label from '../../../../form/Label.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import { InfoIcon } from '../../../../../icons';
import Radio from '../../../../form/input/Radio.tsx';
import DatePicker from '../../../../form/date-picker.tsx';
import InputField from '../../../../form/input/InputField.tsx';
import TextArea from '../../../../form/input/TextArea.tsx';
import DropZonePdf from '../../../../form/form-elements/DropZonePdf.tsx';
import Button from '../../../../ui/button/Button.tsx';
import { useCatalog } from '../../../context/CatalogContext.tsx';

interface Props {
  document?: Document | null;
  onSubmit: (data: CreateDocumentRequest | UpdateDocumentRequest) => Promise<void>;
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
    selectedProcedureType: '',
    docFechaOrigen: '',
    selectedDepartment: '',
    selectedTypeDocument: '',
    selectedPriority: '',
    docCite: '',
    docNumeroCite: '',
    docRemite: '',
    docReferencia: '',
    docAnexos: '',
    docFojas: '',
    file: null as File | null,
  });

  const { addNotification } = useNotifications();

  const [procedures, setProcedures] = useState<Option[]>([]);
  const [priorities, setPriorities] = useState<Option[]>([]);
  const [typeDocuments, setTypeDocuments] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  const [docProcedencia, setDocProcedencia] = useState<'I' | 'E'>('I');
  const [createdDate, setCreatedDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    departments: departmentsData,
    typeDocuments: typeDocumentsData,
    priorities: prioritiesData,
    procedures: proceduresData,
  } = useCatalog();

  function resetForm() {
    setDocProcedencia('I');
    setValue('selectedProcedureType', '');
    setValue('selectedPriority', '');
    setValue('selectedDepartment', '');
    setValue('selectedTypeDocument', '');
    setValue('docFechaOrigen', '');
    setCreatedDate(new Date().toISOString());
    setValue('docCite', '');
    setValue('docNumeroCite', '');
    setValue('docRemite', '');
    setValue('docReferencia', '');
    setValue('docAnexos', '');
    setValue('docFojas', '');
    setValue('file', null);
  }

  useEffect(() => {
    async function loadCatalogs() {
      try {
        setLoadingCatalogs(true);
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
      } catch (err) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: err ? 'No se pudieron cargar los catálogos' : '',
        });
      } finally {
        setLoadingCatalogs(false);
      }
    }
    loadCatalogs();
  }, []);

  useEffect(() => {
    if (!document) {
      resetForm();
      return;
    }
    setDocProcedencia(document.doc_procedencia ?? 'I');
    setValue('docFechaOrigen', document.doc_fecha_origen ?? '');
    setCreatedDate(document.created_at ?? '');
    setValue('docCite', document.doc_cite ?? '');
    setValue('docNumeroCite', document.doc_numero_cite ?? '');
    setValue('docRemite', document.doc_remite ?? '');
    setValue('docReferencia', document.doc_referencia ?? '');
    setValue('docAnexos', document.doc_anexos ?? '');
    setValue('docFojas', document.doc_fojas?.toString() ?? '');
    setValue('selectedProcedureType', String(document.procedure_id ?? ''));
    setValue('selectedPriority', String(document.priority_id ?? ''));
    setValue('selectedDepartment', String(document.department_id ?? ''));
    setValue('selectedTypeDocument', String(document.type_document_id ?? ''));
  }, [document]);

  function validate(): boolean {
    const newErrors: any = {};
    if (!values.docFechaOrigen) newErrors.docFechaOrigen = 'La fecha del documento es requerida';
    if (!values.selectedDepartment) newErrors.selectedDepartment = 'Debe seleccionar un departamento';
    if (!values.selectedTypeDocument) newErrors.selectedTypeDocument = 'Debe seleccionar un tipo de documento';
    if (!values.docRemite.trim()) newErrors.docRemite = 'El remitente es requerido';
    if (!values.docReferencia.trim()) newErrors.docReferencia = 'El objeto / referencia es requerido';
    if (values.docFojas && isNaN(Number(values.docFojas))) newErrors.docFojas = 'Las fojas deben ser numéricas';
    if (!values.docCite.trim()) newErrors.docCite = 'El cite es requerido';
    if (!values.docAnexos.trim()) newErrors.docAnexos = 'Los anexos son requeridos';
    if (!values.docFojas.trim()) newErrors.docFojas = 'El número de fojas es requerido';
    if (!values.docNumeroCite.trim()) newErrors.docNumeroCite = 'El número de cite es requerido';
    if (!values.selectedPriority) newErrors.selectedPriority = 'Debe seleccionar una prioridad';
    if (!values.selectedProcedureType) newErrors.selectedProcedureType = 'Debe seleccionar un tipo de trámite';
    if (!values.file) newErrors.file = 'El archivo es requerido';

    setMultipleErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        doc_procedencia: docProcedencia,
        procedure_id: values.selectedProcedureType ? Number(values.selectedProcedureType) : null,
        department_id: values.selectedDepartment ? Number(values.selectedDepartment) : null,
        type_document_id: values.selectedTypeDocument ? Number(values.selectedTypeDocument) : null,
        priority_id: values.selectedPriority ? Number(values.selectedPriority) : null,
        doc_fecha_origen: values.docFechaOrigen,
        doc_cite: values.docCite.trim(),
        doc_numero_cite: values.docNumeroCite.trim(),
        doc_remite: values.docRemite.trim(),
        doc_referencia: values.docReferencia.trim(),
        doc_anexos: values.docAnexos.trim(),
        doc_fojas: values.docFojas ? Number(values.docFojas) : undefined,
        file: values.file,
      };

      if (document) {
        await onSubmit({
          id: document.id,
          ...payload,
        } as UpdateDocumentRequest);
      } else {
        await onSubmit(payload as CreateDocumentRequest);
      }
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
        message: axiosErr?.response?.data?.message ?? 'Error al guardar el documento',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <Label>
          Origen Documento{' '}
          <Tooltip
            position="bottom"
            content={
              <div>
                <p className="mb-2 font-bold">Origen Documento:</p>
                <p className="mb-2 font-medium">
                  Esta opción determinara si el documento que se adjunta a la hoja de trámite es de procedencia interna
                  cuando es de la misma institución o externa si viene de otra institución o persona.
                </p>
              </div>
            }
          >
            <InfoIcon className="size-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Label>
        <div className="flex items-center gap-6 pt-2">
          <Radio
            id="internal"
            name="docProcedencia"
            value="I"
            checked={docProcedencia === 'I'}
            onChange={(value) => setDocProcedencia(value as 'I' | 'E')}
            label="Interno"
          />
          <Radio
            id="external"
            name="docProcedencia"
            value="E"
            checked={docProcedencia === 'E'}
            onChange={(value) => setDocProcedencia(value as 'I' | 'E')}
            label="Externo"
          />
        </div>
      </div>
      <div>
        <Label>
          Tipo de Trámite<span className="text-error-500">*</span>
        </Label>
        <Select
          options={procedures}
          defaultValue={values.selectedProcedureType}
          loading={loadingCatalogs}
          onChange={(value) => setValue('selectedProcedureType', value)}
          placeholder="Seleccione un trámite"
          error={!!errors.selectedProcedureType}
          hint={errors.selectedProcedureType}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <Label>
            Fecha Documento
            <span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Fecha Documento:</p>
                  <p className="mb-2 font-medium">
                    Se debe colocar la fecha del documento que se adjuntara a la hoja de trámite.
                  </p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <DatePicker
            id="docFechaOrigen"
            picker="date"
            value={values.docFechaOrigen}
            onChange={(value) => setValue('docFechaOrigen', value)}
            placeholder="Seleccione una fecha"
            error={!!errors.docFechaOrigen}
            hint={errors.docFechaOrigen}
          />
        </div>
        <div>
          <Label>
            {'Fecha Creación '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Fecha Creación:</p>
                  <p className="mb-2 font-medium">
                    La fecha de creación no es editable, pero indica la fecha de creación de la hoja de trámite.
                  </p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <DatePicker id="createdDate" value={createdDate} disabled required={false} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <Label>
            Dpto. / Unidad Origen<span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Departamento Origen:</p>
                  <p className="mb-2 font-medium">Se deberá seleccionar el área funcional a la que pertenece.</p>
                </div>
              }
            >
              <InfoIcon className="size-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </Label>
          <Select
            options={departments}
            defaultValue={values.selectedDepartment}
            loading={loadingCatalogs}
            onChange={(value) => setValue('selectedDepartment', value)}
            placeholder="Seleccione un área"
            error={!!errors.selectedDepartment}
            hint={errors.selectedDepartment}
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
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
        <div>
          <Label>
            Cite<span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Cite:</p>
                  <p className="mb-2 font-medium">
                    Es la codificación que genera la repartición, división, áreas funcionales, etc. para su control.
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
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
          />
        </div>
        <div>
          <Label>
            Remitente
            <span className="text-error-500">*</span>{' '}
            <Tooltip
              content={
                <div>
                  <p className="mb-2 font-bold">Remitente:</p>
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
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : document ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
