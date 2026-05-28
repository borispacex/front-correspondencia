import { Document } from "../../types/documents/document.type.ts";
import {DocumentInfo} from "./DocumentInfo.tsx";
import {DocumentRoutes} from "./DocumentRoutes.tsx";

interface DocumentShowProps {
    document?: Document | null;
    isLoadingDocument?: boolean;
    isLoadingHistory?: boolean;
    isSelected?: boolean;
}

export const DocumentShow = ({
                                 document,
                                 isLoadingDocument = false,
                                 isLoadingHistory = false,
                                 isSelected = false,
                             }: DocumentShowProps) => {
    return (
        <div className="flex flex-col gap-5 xl:flex-row">

            {/* LEFT */}
            <div className="w-full xl:flex-1 min-w-0">
                <DocumentInfo
                    document={document}
                    isLoading={isLoadingDocument}
                    isSelected={isSelected}
                />
            </div>

            {/* RIGHT */}
            <div className="w-full xl:flex-1 min-w-0">
                <DocumentRoutes
                    document={document}
                    isLoading={isLoadingHistory}
                    isSelected={isSelected}
                />
            </div>

        </div>
    );
};