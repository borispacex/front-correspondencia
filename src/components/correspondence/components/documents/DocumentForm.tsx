import { useEffect, useState } from "react";

import {
    CreateDocumentRequest,
    Document,
    UpdateDocumentRequest,
} from "../../types/documents/document.type.ts";

import Label from "../../../form/Label.tsx";
import InputField from "../../../form/input/InputField.tsx";
import Button from "../../../ui/button/Button.tsx";
import Radio from "../../../form/input/Radio.tsx";
import DatePicker from "../../../form/date-picker.tsx";

import Select, { Option } from "../../../form/Select.tsx";

import { getDepartments } from "../../services/department.service.ts";
import { getTypeDocuments } from "../../services/type-document.service.ts";
import { getPriorities } from "../../services/priority.service.ts";
import { getProcedures } from "../../services/procedure.service.ts";
import DropZonePdf from "../../../form/form-elements/DropZonePdf.tsx";
import {InfoIcon} from "../../../../icons";
import Tooltip from "../../../form/Tooltip.tsx";
import TextArea from "../../../form/input/TextArea.tsx";

interface DocumentFormProps {
    document?: Document | null;

    onSubmit: (
        data: CreateDocumentRequest | UpdateDocumentRequest
    ) => Promise<void>;

    onCancel: () => void;
}

function mapToOptions<T>(
    items: T[],
    valueKey: keyof T,
    labelKey: keyof T
): Option[] {
    return items.map((item) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
    }));
}

export default function DocumentForm({
                                         document,
                                         onSubmit,
                                         onCancel,
                                     }: DocumentFormProps) {

    const [procedures, setProcedures] = useState<Option[]>([]);
    const [priorities, setPriorities] = useState<Option[]>([]);
    const [typeDocuments, setTypeDocuments] = useState<Option[]>([]);
    const [departments, setDepartments] = useState<Option[]>([]);
    const [loadingCatalogs, setLoadingCatalogs] = useState(false);

    const [docProcedencia, setDocProcedencia] = useState<"I" | "E">("I");
    const [selectedProcedureType, setSelectedProcedureType] = useState<Option | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<Option | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Option | null>(null);
    const [selectedTypeDocument, setSelectedTypeDocument] = useState<Option | null>(null);
    const [docFechaOrigen, setDocFechaOrigen] = useState("");
    const [createdDate, setCreatedDate] = useState(() =>
                new Date()
                    .toISOString()
                    .split("T")[0]
        );

    const [docCite, setDocCite] = useState("");
    const [docNumeroCite, setDocNumeroCite] = useState("");
    const [docRemite, setDocRemite] = useState("");
    const [docReferencia, setDocReferencia] = useState("");
    const [docAnexos, setDocAnexos] = useState("");
    const [docFojas, setDocFojas] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    function resetForm() {
        setDocProcedencia("I");

        setSelectedProcedureType(null);
        setSelectedPriority(null);
        setSelectedDepartment(null);
        setSelectedTypeDocument(null);

        setDocFechaOrigen("");

        setCreatedDate(
            new Date()
                .toISOString()
                .split("T")[0]
        );

        setDocCite("");
        setDocNumeroCite("");
        setDocRemite("");
        setDocReferencia("");
        setDocAnexos("");
        setDocFojas("");

        setFile(null);
        setError(null);

        setFieldErrors({});
    }

    useEffect(() => {
        async function loadCatalogs() {
            try {
                setLoadingCatalogs(true);
                const [
                    departmentsData,
                    typeDocumentsData,
                    prioritiesData,
                    proceduresData,
                ] = await Promise.all([
                    getDepartments(),
                    getTypeDocuments(),
                    getPriorities(),
                    getProcedures(),
                ]);
                setDepartments(
                    mapToOptions(
                        departmentsData,
                        "id",
                        "dep_name"
                    )
                );
                setTypeDocuments(
                    mapToOptions(
                        typeDocumentsData,
                        "id",
                        "typ_name"
                    )
                );
                setPriorities(
                    prioritiesData.map((item) => ({
                        value: String(item.id),
                        label: String(item.pri_name)
                            .replace(/<[^>]*>/g, "")
                            .trim(),
                    }))
                );
                setProcedures(
                    mapToOptions(
                        proceduresData,
                        "id",
                        "proc_name"
                    )
                );
            } catch (err) {
                setError(
                    "No se pudieron cargar los catálogos"
                );
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
        setDocProcedencia(
            document.doc_procedencia ?? "I"
        );
        setDocFechaOrigen(
            document.doc_fecha_origen ?? ""
        );
        setDocCite(
            document.doc_cite ?? ""
        );
        setDocNumeroCite(
            document.doc_numero_cite ?? ""
        );
        setDocRemite(
            document.doc_remite ?? ""
        );
        setDocReferencia(
            document.doc_referencia ?? ""
        );
        setDocAnexos(
            document.doc_anexos ?? ""
        );
        setDocFojas(
            document.doc_fojas?.toString() ?? ""
        );
        setSelectedProcedureType(
            procedures.find(
                (item) =>
                    item.value ===
                    String(document.procedure_id)
            ) ?? null
        );
        setSelectedPriority(
            priorities.find(
                (item) =>
                    item.value ===
                    String(document.priority_id)
            ) ?? null
        );

        setSelectedDepartment(
            departments.find(
                (item) =>
                    item.value ===
                    String(document.department_id)
            ) ?? null
        );

        setSelectedTypeDocument(
            typeDocuments.find(
                (item) =>
                    item.value ===
                    String(document.type_document_id)
            ) ?? null
        );

    }, [
        document,
        procedures,
        priorities,
        departments,
        typeDocuments,
    ]);

    function validate(): boolean {

        const errors: Record<string, string> = {};
        if (!docFechaOrigen) {
            errors.docFechaOrigen = "La fecha del documento es requerida";
        }
        if (!selectedDepartment) {
            errors.selectedDepartment = "Debe seleccionar un departamento";
        }
        if (!selectedTypeDocument) {
            errors.selectedTypeDocument = "Debe seleccionar un tipo de documento";
        }
        if (!docRemite.trim()) {
            errors.docRemite = "El remitente es requerido";
        }
        if (!docReferencia.trim()) {
            errors.docReferencia = "El objeto / referencia es requerido";
        }
        if (docFojas && isNaN(Number(docFojas))) {
            errors.docFojas = "Las fojas deben ser numéricas";
        }
        if (!docCite.trim()) {
            errors.docCite = "El cite es requerido";
        }
        if (!docAnexos.trim()) {
            errors.docAnexos = "Los anexos son requeridos";
        }
        if (!docFojas.trim()) {
            errors.docFojas = "El número de fojas es requerido";
        }
        if (!docNumeroCite.trim()) {
            errors.docNumeroCite = "El número de cite es requerido";
        }
        if (!selectedPriority) {
            errors.selectedPriority = "Debe seleccionar una prioridad";
        }
        if (!selectedProcedureType) {
            errors.selectedProcedureType = "Debe seleccionar un tipo de tramite";
        }
        if (!file) {
            errors.file = "El archivo es requerido";
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                doc_procedencia: docProcedencia,
                procedure_id: selectedProcedureType?.value
                        ? Number(
                            selectedProcedureType.value
                        ) : null,
                department_id: selectedDepartment?.value
                        ? Number(
                            selectedDepartment.value
                        ) : null,
                type_document_id: selectedTypeDocument?.value
                        ? Number(
                            selectedTypeDocument.value
                        ) : null,
                priority_id: selectedPriority?.value
                        ? Number(
                            selectedPriority.value
                        ) : null,
                doc_fecha_origen: docFechaOrigen,
                doc_cite: docCite.trim(),
                doc_numero_cite: docNumeroCite.trim(),
                doc_remite: docRemite.trim(),
                doc_referencia: docReferencia.trim(),
                doc_anexos: docAnexos.trim(),
                doc_fojas: docFojas ? Number(docFojas) : undefined,
                file,
            };

            if (document) {
                await onSubmit({
                    id: document.id,
                    ...payload,
                } as UpdateDocumentRequest);
            } else {
                await onSubmit(
                    payload as CreateDocumentRequest
                );
            }
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };
            setError(
                axiosErr?.response?.data?.message ??
                "Error al guardar el documento"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <Label>
                    {'Origen Documento '}
                    <Tooltip
                        position="bottom"
                        content={
                            <div>
                                <p className="mb-2 font-bold">
                                    Origen Documento:
                                </p>
                                <p className="mb-2 font-medium">
                                    Esta opción determinara si el documento que se adjunta a la hoja de trámite es de procedencia interna cuando es de la misma institución o externa si viene de otra institución o persona.
                                </p>
                            </div>
                        }
                    >
                        <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                    </Tooltip>
                </Label>
                <div className="flex items-center gap-6 pt-2">
                    <Radio
                        id="internal"
                        name="docProcedencia"
                        value="I"
                        checked={docProcedencia === "I"}
                        onChange={(value) =>
                            setDocProcedencia(
                                value as "I" | "E"
                            )
                        }
                        label="Interno"
                    />
                    <Radio
                        id="external"
                        name="docProcedencia"
                        value="E"
                        checked={docProcedencia === "E"}
                        onChange={(value) =>
                            setDocProcedencia(
                                value as "I" | "E"
                            )
                        }
                        label="Externo"
                    />
                </div>
            </div>

            <div>
                <Label>
                    {'Tipo de Trámite '}
                </Label>
                <Select
                    options={procedures}
                    value={selectedProcedureType}
                    loading={loadingCatalogs}
                    onChange={setSelectedProcedureType}
                    placeholder="Seleccione un trámite"
                    error={!!fieldErrors.selectedProcedureType}
                    hint={fieldErrors.selectedProcedureType}
                />

            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                    <Label>
                        Fecha Documento
                        <span className="text-error-500">*</span>
                        {' '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Fecha Documento:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        Se debe colocar la fecha del documento que se adjuntara a la hoja de tramite.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>
                    <DatePicker
                        id="docFechaOrigen"
                        value={docFechaOrigen}
                        onChange={setDocFechaOrigen}
                        placeholder="Seleccione una fecha"
                        error={!!fieldErrors.docFechaOrigen}
                        hint={fieldErrors.docFechaOrigen}
                    />
                </div>

                <div>
                    <Label>
                        {'Fecha Creación '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Fecha Creación:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        La fecha de creación no es editable, pero indica la fecha de creación de la hoja de tramite.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>
                    <InputField
                        type="date"
                        value={createdDate}
                        disabled
                        onChange={() => {}}
                        error={!!fieldErrors.createdDate}
                        hint={fieldErrors.createdDate}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                    <Label>
                        Dpto. / Unidad Origen<span className="text-error-500">*</span>
                        {' '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Departamento Origen:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        Se deberá seleccionar el área funcional a la que pertenece.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>
                    <Select
                        options={departments}
                        value={selectedDepartment}
                        loading={loadingCatalogs}
                        onChange={setSelectedDepartment}
                        placeholder="Seleccione un área"
                        error={!!fieldErrors.selectedDepartment}
                        hint={fieldErrors.selectedDepartment}
                    />
                </div>

                <div>
                    <Label>
                        Tipo de Documento<span className="text-error-500">*</span>
                        {' '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Tipo de Documento:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        Se debe seleccionar el tipo de documento que se adjunta a la hora de tramite.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>
                    <Select
                        options={typeDocuments}
                        value={selectedTypeDocument}
                        loading={loadingCatalogs}
                        onChange={setSelectedTypeDocument}
                        placeholder="Seleccione un documento"
                        error={!!fieldErrors.selectedTypeDocument}
                        hint={fieldErrors.selectedTypeDocument}
                    />
                </div>

            </div>
            {/* Prioridad / Cite */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>

                    <Label>
                        Prioridad<span className="text-error-500">*</span>
                        {' '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Prioridad:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        Se debe seleccionar la prioridad con la que se debe atender este documento.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>

                    <Select
                        options={priorities}
                        value={selectedPriority}
                        loading={loadingCatalogs}
                        onChange={setSelectedPriority}
                        placeholder="Seleccione prioridad"
                        error={!!fieldErrors.selectedPriority}
                        hint={fieldErrors.selectedPriority}
                    />

                </div>

                <div>

                    <Label>
                        Cite<span className="text-error-500">*</span>
                        {' '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Cite:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        Es la codificación que genera la repartición, división, áreas funcionales, etc. para su control.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>

                    <InputField
                        value={docCite}
                        onChange={(e) =>
                            setDocCite(e.target.value)
                        }
                        placeholder="Cite"
                        error={!!fieldErrors.docCite}
                        hint={fieldErrors.docCite}
                    />

                </div>

            </div>

            {/* Número Cite / Remitente */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>

                    <Label>
                        Nro. Cite<span className="text-error-500">*</span>
                    </Label>

                    <InputField
                        value={docNumeroCite}
                        onChange={(e) =>
                            setDocNumeroCite(e.target.value)
                        }
                        placeholder="Nro. Cite"
                        error={!!fieldErrors.docNumeroCite}
                        hint={fieldErrors.docNumeroCite}
                    />

                </div>

                <div>

                    <Label>
                        Remitente
                        <span className="text-error-500">*</span>
                        {' '}
                        <Tooltip
                            content={
                                <div>
                                    <p className="mb-2 font-bold">
                                        Remitente:
                                    </p>
                                    <p className="mb-2 font-medium">
                                        La persona encargada del área funcional quien está enviando la hoja de tramite.
                                    </p>
                                </div>
                            }
                        >
                            <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                        </Tooltip>
                    </Label>

                    <InputField
                        value={docRemite}
                        onChange={(e) =>
                            setDocRemite(e.target.value)
                        }
                        placeholder="Remitente"
                        error={!!fieldErrors.docRemite}
                        hint={fieldErrors.docRemite}
                    />
                </div>

            </div>

            {/* Referencia */}
            <div>

                <Label>
                    Objeto / Referencia
                    <span className="text-error-500">*</span>
                    {' '}
                    <Tooltip
                        content={
                            <div>
                                <p className="mb-2 font-bold">
                                    Objeto / Referencia:
                                </p>
                                <p className="mb-2 font-medium">
                                    Se debe colocar el objeto del documento que se adjunta a la hoja de tramite.
                                </p>
                            </div>
                        }
                    >
                        <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                    </Tooltip>
                </Label>

                <TextArea
                    rows={4}
                    value={docReferencia}
                    onChange={setDocReferencia}
                    placeholder="Referencia"
                    error={!!fieldErrors.docReferencia}
                    hint={fieldErrors.docReferencia}
                />
            </div>

            {/* Anexos / Fojas */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>
                    <Label>
                        Anexos
                        <span className="text-error-500">*</span>
                    </Label>
                    <InputField
                        value={docAnexos}
                        onChange={(e) =>
                            setDocAnexos(e.target.value)
                        }
                        placeholder="Anexos"
                        error={!!fieldErrors.docAnexos}
                        hint={fieldErrors.docAnexos}
                    />
                </div>

                <div>
                    <Label>
                        Fojas
                        <span className="text-error-500">*</span>
                    </Label>
                    <InputField
                        type="number"
                        value={docFojas}
                        onChange={(e) =>
                            setDocFojas(e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        error={!!fieldErrors.docFojas}
                        hint={fieldErrors.docFojas}
                    />
                </div>

            </div>

            {/* Archivo */}
            <div>

                <Label>
                    Archivo
                    <span className="text-error-500">*</span>
                    {' '}
                    <Tooltip
                        content={
                            <div>
                                <p className="mb-2 font-bold">
                                    Archivo:
                                </p>
                                <p className="mb-2 font-medium">
                                    Se debe adjuntar el archivo en formato PDF.
                                </p>
                            </div>
                        }
                    >
                        <InfoIcon className="size-4 text-gray-400 cursor-pointer" />
                    </Tooltip>
                </Label>

                <DropZonePdf
                    size="sm"
                    value={file}
                    onChange={setFile}
                    maxSizeMB={10}
                    error={!!fieldErrors.file}
                    hint={fieldErrors.file}
                    required
                />
                {document?.doc_url && !file && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Archivo actual:{" "}
                        <a
                            href={document.doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-500 underline"
                        >
                            ver archivo
                        </a>
                    </p>
                )}

            </div>

            {/* Error Global */}
            {error && (

                <div className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-900/20 dark:text-error-400">
                    {error}
                </div>

            )}

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-2">

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >

                    {isSubmitting
                        ? "Guardando..."
                        : document
                            ? "Actualizar"
                            : "Guardar"}

                </Button>

            </div>

        </form>
    );
}