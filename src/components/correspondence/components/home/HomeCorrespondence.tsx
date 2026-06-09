import CorrespDashboard from './corresp/CorrespDashboard.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';

export const HomeCorrespondence = () => {
  return (
    <>
      <div className="col-span-6 space-y-6 xl:col-span-7">
        {/* Dashboard completo de administración */}
        <AdminDashboard />

        {/* Dashboard completo de correspondencia */}
        <CorrespDashboard />
      </div>
    </>
  );
};
