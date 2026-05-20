import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserPhotoCard from "../components/UserProfile/UserPhotoCard.tsx";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserChangePasswordCard from "../components/UserProfile/UserChangePasswordCard.tsx";

export default function UserProfiles() {
  return (
    <>
      <PageBreadcrumb pageTitle="Perfil" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserPhotoCard />
          <UserInfoCard />
          <UserChangePasswordCard />
        </div>
      </div>
    </>
  );
}
