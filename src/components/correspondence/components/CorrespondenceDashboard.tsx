import CorrespDashboard from './metrics/corresp/CorrespDashboard.tsx';
import AdminDashboard from './metrics/admin/AdminDashboard.tsx';

export const CorrespondenceDashboard = () => {
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
