import AuthLayout from './AuthPageLayout';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm.tsx';
import { APP_NAME } from '../../components/correspondence/constants/correspondence.constants.ts';
import PageMeta from '../../components/common/PageMeta.tsx';

export default function ResetPassword() {
  return (
    <>
      <PageMeta title={`Restablecer contraseña | ${APP_NAME}`} description="Formulario para restablecer contraseña" />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
