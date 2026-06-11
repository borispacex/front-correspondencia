import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Priority } from '../types/catalog/priority.type.ts';
import { Department } from '../types/catalog/department.type.ts';
import { Unit } from '../types/unit.type.ts';
import { Procedure } from '../types/catalog/procedure.type.ts';
import { Provided } from '../types/catalog/provided.type.ts';
import { StateDocument } from '../types/catalog/state-document.type.ts';
import { TypeDocument } from '../types/catalog/type-document.type.ts';
import { getPriorities } from '../services/catalog/priority.service.ts';
import { getDepartments } from '../services/catalog/department.service.ts';
import { getUnits } from '../services/catalog/unit.service.ts';
import { getProcedures } from '../services/catalog/procedure.service.ts';
import { getStateDocuments } from '../services/catalog/state-document.service.ts';
import { getProvides } from '../services/catalog/provided.service.ts';
import { getTypeDocuments } from '../services/catalog/type-document.service.ts';
import { Origin } from '../types/catalog/origin.type.ts';
import { ORIGINS } from '../constants/origin.constants.ts';

interface CatalogContextType {
  priorities: Priority[];
  departments: Department[];
  units: Unit[];
  provides: Provided[];
  procedures: Procedure[];
  stateDocuments: StateDocument[];
  typeDocuments: TypeDocument[];
  origins: Origin[];

  isLoading: boolean;

  reload: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [provides, setProviders] = useState<Provided[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [stateDocuments, setStateDocuments] = useState<StateDocument[]>([]);
  const [typeDocuments, setTypeDocuments] = useState<TypeDocument[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const loadCatalogs = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        prioritiesResponse,
        departmentsResponse,
        unitsResponse,
        providesResponse,
        proceduresResponse,
        stateDocumentsResponse,
        typeDocumentsResponse,
      ] = await Promise.all([
        getPriorities(),
        getDepartments(),
        getUnits(),
        getProvides(),
        getProcedures(),
        getStateDocuments(),
        getTypeDocuments(),
      ]);

      setPriorities(prioritiesResponse);
      setDepartments(departmentsResponse);
      setUnits(unitsResponse);
      setProviders(providesResponse);
      setProcedures(proceduresResponse);
      setStateDocuments(stateDocumentsResponse);
      setTypeDocuments(typeDocumentsResponse);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  const value = useMemo(
    () => ({
      priorities,
      departments,
      units,
      provides,
      procedures,
      stateDocuments,
      typeDocuments,
      origins: ORIGINS,

      isLoading,

      reload: loadCatalogs,
    }),
    [priorities, departments, units, provides, procedures, stateDocuments, typeDocuments, isLoading, loadCatalogs],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error('useCatalog debe utilizarse dentro de CatalogProvider');
  }

  return context;
}
