import { Outlet } from 'react-router';
import { CatalogProvider } from '../context/CatalogContext.tsx';

export const CorrespondenceLayout = () => {
  return (
    <div>
      <CatalogProvider>
        <Outlet />
      </CatalogProvider>
    </div>
  );
};
