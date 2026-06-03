// ─────────────────────────────────────────────────────────────
// context/DocumentCountContext.tsx
//
// Patrón: store externo (vanilla JS) + contexto React.
//
// El store vive fuera de React, así el servicio document.service.ts
// puede escribir en él directamente sin necesitar hooks.
// El Provider se suscribe al store y re-renderiza cuando cambia.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DocumentCounts {
  all: number;
  pending: number;
  attended: number;
  archived: number;
}

// ── Store externo (fuera de React) ───────────────────────────
// El servicio importa esto directamente y llama a .set()
type Listener = (counts: DocumentCounts) => void;

const DEFAULT: DocumentCounts = { all: 0, pending: 0, attended: 0, archived: 0 };

function createDocumentCountStore() {
  let current = { ...DEFAULT };
  const listeners = new Set<Listener>();

  return {
    get: () => current,
    set: (next: DocumentCounts) => {
      current = next;
      listeners.forEach((fn) => fn(current));
    },
    subscribe: (fn: Listener) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export const documentCountStore = createDocumentCountStore();

// ── Contexto React ───────────────────────────────────────────
const DocumentCountContext = createContext<DocumentCounts>(DEFAULT);

export function DocumentCountProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<DocumentCounts>(documentCountStore.get);

  useEffect(() => {
    // Suscribirse al store externo; cuando el servicio llame a
    // documentCountStore.set(), este componente re-renderiza.
    return documentCountStore.subscribe(setCounts);
  }, []);

  return <DocumentCountContext.Provider value={counts}>{children}</DocumentCountContext.Provider>;
}

export function useDocumentCounts() {
  return useContext(DocumentCountContext);
}
