import { useEffect, useState } from "react";
import {
    Area,
    CreateDocumentRequest,
    UpdateDocumentRequest
} from "../../types/documents/document.type.ts";
import Label from "../../../form/Label.tsx";
import Checkbox from "../../../form/input/Checkbox.tsx";
import SearchSelect from "../../../form/SearchSelect.tsx";
import InputField from "../../../form/input/InputField.tsx";
import Button from "../../../ui/button/Button.tsx";



interface Option {
    id: string;
    name: string;
}

interface DocumentFormProps {
    document?: Document | null;

    onSubmit: (
        data: CreateDocumentRequest | UpdateDocumentRequest
    ) => Promise<void>;

    onCancel: () => void;
}

export default function DocumentForm({
                                        document,
                                        onSubmit,
                                        onCancel,
                                    }: DocumentFormProps) {

    const procedureTypes: Option[] = [
        { id: "NORMAL", name: "NORMAL" },
        { id: "URGENTE", name: "URGENTE" },
        { id: "MUY_URGENTE", name: "MUY URGENTE" },
    ];

    const priorities: Option[] = [
        { id: "NORMAL", name: "NORMAL" },
        { id: "URGENTE", name: "URGENTE" },
        { id: "ALTA", name: "ALTA" },
    ];

    const [documentOrigin, setDocumentOrigin] = useState<"INTERNO" | "EXTERNO">(
        "INTERNO"
    );

    const [selectedProcedureType, setSelectedProcedureType] =
        useState<Option | null>(procedureTypes[0]);

    const [documentDate, setDocumentDate] = useState("");

    const [createdDate, setCreatedDate] = useState("");

    const [allAreas, setAllAreas] = useState<Area[]>([]);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    const [allDocumentTypes, setAllDocumentTypes] = useState<DocumentType[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] =
        useState<DocumentType | null>(null);

    const [selectedPriority, setSelectedPriority] =
        useState<Option | null>(priorities[0]);

    const [cite, setCite] = useState("");

    const [citeNumber, setCiteNumber] = useState("");

    const [sender, setSender] = useState("");

    const [reference, setReference] = useState("");

    const [attachments, setAttachments] = useState("");

    const [pages, setPages] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const [active, setActive] = useState(true);

    const [loadingAreas, setLoadingAreas] = useState(true);

    const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        setLoadingAreas(true);

        setAllAreas([]);
        // getAreas()
        //     .then((data) => setAllAreas(data))
        //     .catch(() => {})
        //     .finally(() => setLoadingAreas(false));

    }, []);

    useEffect(() => {

        setLoadingDocumentTypes(true);

        setAllDocumentTypes([]);
        // getDocumentTypes()
        //     .then((data) => setAllDocumentTypes(data))
        //     .catch(() => {})
        //     .finally(() => setLoadingDocumentTypes(false));

    }, []);

    useEffect(() => {

        setDocumentOrigin(
            document?.document_origin ?? "INTERNO"
        );

        setDocumentDate(
            document?.document_date ?? ""
        );

        setCreatedDate(
            document?.created_date ?? ""
        );

        setCite(
            document?.cite ?? ""
        );

        setCiteNumber(
            document?.cite_number ?? ""
        );

        setSender(
            document?.sender ?? ""
        );

        setReference(
            document?.reference ?? ""
        );

        setAttachments(
            document?.attachments ?? ""
        );

        setPages(
            document?.pages?.toString() ?? ""
        );

        setActive(
            document?.active ?? true
        );

        setError(null);

        if (document?.procedure_type) {

            const foundProcedureType = procedureTypes.find(
                (item) => item.id === document.procedure_type
            ) ?? null;

            setSelectedProcedureType(foundProcedureType);
        }

        if (document?.priority) {

            const foundPriority = priorities.find(
                (item) => item.id === document.priority
            ) ?? null;

            setSelectedPriority(foundPriority);
        }

        if (document?.origin_area_id && allAreas.length > 0) {

            const foundArea = allAreas.find(
                (area) => area.id === document.origin_area_id
            ) ?? null;

            setSelectedArea(foundArea);
        }

        if (document?.document_type_id && allDocumentTypes.length > 0) {

            const foundDocumentType = allDocumentTypes.find(
                (item) => item.id === document.document_type_id
            ) ?? null;

            setSelectedDocumentType(foundDocumentType);
        }

    }, [document, allAreas, allDocumentTypes]);

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        if (!documentDate) {
            setError("La fecha del documento es requerida");
            return;
        }

        if (!selectedArea) {
            setError("Debe seleccionar un área");
            return;
        }

        if (!selectedDocumentType) {
            setError("Debe seleccionar un tipo de documento");
            return;
        }

        if (!reference.trim()) {
            setError("La referencia es requerida");
            return;
        }

        setIsSubmitting(true);

        setError(null);

        try {

            const payload = {
                document_origin: documentOrigin,

                procedure_type: selectedProcedureType?.id ?? "",

                document_date: documentDate,

                created_date: createdDate,

                origin_area_id: selectedArea.id,

                document_type_id: selectedDocumentType.id,

                priority: selectedPriority?.id ?? "",

                cite: cite.trim(),

                cite_number: citeNumber.trim(),

                sender: sender.trim(),

                reference: reference.trim(),

                attachments: attachments.trim(),

                pages: Number(pages) || 0,

                active,

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
                "Error al guardar la hoja de trámite"
            );

        } finally {

            setIsSubmitting(false);

        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Origen Documento
                    </Label>

                    <div className="flex items-center gap-5 pt-2">

                        <Checkbox
                            label="Interno"
                            checked={documentOrigin === "INTERNO"}
                            onChange={() => setDocumentOrigin("INTERNO")}
                        />

                        <Checkbox
                            label="Externo"
                            checked={documentOrigin === "EXTERNO"}
                            onChange={() => setDocumentOrigin("EXTERNO")}
                        />

                    </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Tipo de Trámite
                    </Label>

                    <SearchSelect
                        options={procedureTypes}
                        value={selectedProcedureType}
                        onChange={setSelectedProcedureType}
                        placeholder="Seleccione un tipo"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.name}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Fecha Documento
                        <span className="text-error-500">*</span>
                    </Label>

                    <InputField
                        type="date"
                        value={documentDate}
                        onChange={(e) => setDocumentDate(e.target.value)}
                    />
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Fecha Creación
                    </Label>

                    <InputField
                        type="date"
                        value={createdDate}
                        disabled
                        onChange={(e) => setCreatedDate(e.target.value)}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Dpto. / Unidad Origen
                        <span className="text-error-500">*</span>
                    </Label>

                    <SearchSelect
                        options={allAreas}
                        value={selectedArea}
                        loading={loadingAreas}
                        onChange={setSelectedArea}
                        placeholder="Seleccione un área"
                        getOptionValue={(area) => area.id}
                        getOptionLabel={(area) => area.name}
                    />
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Tipo de Documento
                        <span className="text-error-500">*</span>
                    </Label>

                    <SearchSelect
                        options={allDocumentTypes}
                        value={selectedDocumentType}
                        loading={loadingDocumentTypes}
                        onChange={setSelectedDocumentType}
                        placeholder="Seleccione un documento"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.name}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Prioridad
                    </Label>

                    <SearchSelect
                        options={priorities}
                        value={selectedPriority}
                        onChange={setSelectedPriority}
                        placeholder="Seleccione prioridad"
                        getOptionValue={(item) => item.id}
                        getOptionLabel={(item) => item.name}
                    />
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Cite
                    </Label>

                    <InputField
                        value={cite}
                        onChange={(e) => setCite(e.target.value)}
                        placeholder="Cite"
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Nro. Cite
                    </Label>

                    <InputField
                        value={citeNumber}
                        onChange={(e) => setCiteNumber(e.target.value)}
                        placeholder="Nro. Cite"
                    />
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Remitente
                    </Label>

                    <InputField
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        placeholder="Remitente"
                    />
                </div>

            </div>

            <div>
                <Label>
                    Objeto / Referencia
                    <span className="text-error-500">*</span>
                </Label>

                <textarea
                    rows={4}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Referencia"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-theme-xs outline-none transition focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Anexos
                    </Label>

                    <InputField
                        value={attachments}
                        onChange={(e) => setAttachments(e.target.value)}
                        placeholder="Anexos"
                    />
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Label>
                        Fojas
                    </Label>

                    <InputField
                        type="number"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        placeholder="0"
                    />
                </div>

            </div>

            <div>
                <Label>
                    Archivo
                </Label>

                <InputField
                    type="file"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0] ?? null;
                        setFile(selectedFile);
                    }}
                />
            </div>

            <div className="flex items-center gap-3">

                <Checkbox
                    label="Activo"
                    checked={active}
                    onChange={(checked) => setActive(checked)}
                    size="md"
                />

            </div>

            {error && (
                <p className="text-sm text-error-500">
                    {error}
                </p>
            )}

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
                            : "Crear"}
                </Button>

            </div>

        </form>
    );
}