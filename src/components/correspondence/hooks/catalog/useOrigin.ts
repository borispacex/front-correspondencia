import { useCatalog } from '../../context/CatalogContext.tsx';

export function useOrigin() {
  const { origins } = useCatalog();

  const getNameByValue = (value?: 'I' | 'E') => {
    return findByValue(value)?.label ?? '';
  };

  const findByValue = (value?: 'I' | 'E') => {
    return origins.find((item) => item.value === value);
  };

  return {
    origins,
    findByValue,
    getNameByValue,
  };
}
