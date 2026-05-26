import { useEffect, useState } from "react";

import {
    CreateDocumentRequest,
    Document,
    UpdateDocumentRequest,
} from "../../types/documents/document.type.ts";

import Label from "../../../form/Label.tsx";
import Checkbox from "../../../form/input/Checkbox.tsx";
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

    function FieldError({field}: { field: string; }) {
        return fieldErrors[field] ? (
            <p className="mt-1 text-xs text-error-500">
                {fieldErrors[field]}
            </p>
        ) : null;
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
                    mapToOptions(
                        prioritiesData,
                        "id",
                        "pri_name"
                    )
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
                <Label>Origen Documento</Label>
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
                <Label>Tipo de Trámite</Label>
                <Select
                    options={procedures}
                    value={selectedProcedureType}
                    loading={loadingCatalogs}
                    onChange={setSelectedProcedureType}
                    placeholder="Seleccione un trámite"
                />

            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                    <Label>Fecha Documento<span className="text-error-500">*</span></Label>
                    <DatePicker
                        id="docFechaOrigen"
                        value={docFechaOrigen}
                        onChange={setDocFechaOrigen}
                        placeholder="Seleccione una fecha"
                    />
                    <FieldError field="docFechaOrigen" />
                </div>

                <div>
                    <Label>Fecha Creación</Label>
                    <InputField
                        type="date"
                        value={createdDate}
                        disabled
                        onChange={() => {}}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                    <Label>Dpto. / Unidad Origen<span className="text-error-500">*</span></Label>
                    <Select
                        options={departments}
                        value={selectedDepartment}
                        loading={loadingCatalogs}
                        onChange={setSelectedDepartment}
                        placeholder="Seleccione un área"
                    />
                    <FieldError field="selectedDepartment" />
                </div>

                <div>
                    <Label>Tipo de Documento<span className="text-error-500">*</span></Label>
                    <Select
                        options={typeDocuments}
                        value={selectedTypeDocument}
                        loading={loadingCatalogs}
                        onChange={setSelectedTypeDocument}
                        placeholder="Seleccione un documento"
                    />

                    <FieldError field="selectedTypeDocument" />

                </div>

            </div>
            {/* Prioridad / Cite */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>

                    <Label>
                        Prioridad
                    </Label>

                    <Select
                        options={priorities}
                        value={selectedPriority}
                        loading={loadingCatalogs}
                        onChange={setSelectedPriority}
                        placeholder="Seleccione prioridad"
                    />

                </div>

                <div>

                    <Label>
                        Cite
                    </Label>

                    <InputField
                        value={docCite}
                        onChange={(e) =>
                            setDocCite(e.target.value)
                        }
                        placeholder="Cite"
                    />

                </div>

            </div>

            {/* Número Cite / Remitente */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>

                    <Label>
                        Nro. Cite
                    </Label>

                    <InputField
                        value={docNumeroCite}
                        onChange={(e) =>
                            setDocNumeroCite(e.target.value)
                        }
                        placeholder="Nro. Cite"
                    />

                </div>

                <div>

                    <Label>
                        Remitente
                        <span className="text-error-500">*</span>
                    </Label>

                    <InputField
                        value={docRemite}
                        onChange={(e) =>
                            setDocRemite(e.target.value)
                        }
                        placeholder="Remitente"
                    />

                    <FieldError field="docRemite" />

                </div>

            </div>

            {/* Referencia */}
            <div>

                <Label>
                    Objeto / Referencia
                    <span className="text-error-500">*</span>
                </Label>

                <textarea
                    rows={4}
                    value={docReferencia}
                    onChange={(e) =>
                        setDocReferencia(e.target.value)
                    }
                    placeholder="Referencia"
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-700 shadow-theme-xs outline-none transition focus:border-brand-300 dark:bg-gray-900 dark:text-gray-400 ${
                        fieldErrors.docReferencia
                            ? "border-error-500 focus:border-error-400"
                            : "border-gray-300 dark:border-gray-700"
                    }`}
                />

                <FieldError field="docReferencia" />

            </div>

            {/* Anexos / Fojas */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>

                    <Label>
                        Anexos
                    </Label>

                    <InputField
                        value={docAnexos}
                        onChange={(e) =>
                            setDocAnexos(e.target.value)
                        }
                        placeholder="Anexos"
                    />

                </div>

                <div>

                    <Label>
                        Fojas
                    </Label>

                    <InputField
                        type="number"
                        value={docFojas}
                        onChange={(e) =>
                            setDocFojas(e.target.value)
                        }
                        placeholder="0"
                        min="0"
                    />

                    <FieldError field="docFojas" />

                </div>

            </div>

            {/* Archivo */}
            <div>

                <Label>
                    Archivo
                </Label>

                <DropZonePdf
                    size="sm"
                    value={file}
                    onChange={setFile}
                    maxSizeMB={10}
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