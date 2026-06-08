import PageBreadcrumb from '../components/common/PageBreadCrumb';
import UserPhotoCard from '../components/UserProfile/UserPhotoCard.tsx';
import UserInfoCard from '../components/UserProfile/UserInfoCard';
import UserChangePasswordCard from '../components/UserProfile/UserChangePasswordCard.tsx';
import PageMeta from '../components/common/PageMeta.tsx';
import { APP_NAME } from '../components/correspondence/constants/correspondence.constants.ts';

export default function UserProfiles() {
  return (
    <>
      <PageMeta title={`Perfil | ${APP_NAME}`} description="Información de usuario" />
      <PageBreadcrumb pageTitle="Perfil" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="space-y-6">
          <UserPhotoCard />
          <UserInfoCard />
          <UserChangePasswordCard />
        </div>
      </div>
    </>
  );
}
