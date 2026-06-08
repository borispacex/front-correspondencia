import AuthLayout from './AuthPageLayout';
import SignInForm from '../../components/auth/SignInForm';
import PageMeta from '../../components/common/PageMeta.tsx';
import { APP_NAME } from '../../components/correspondence/constants/correspondence.constants.ts';

export default function SignIn() {
  return (
    <>
      <PageMeta title={`Inciar sesión | ${APP_NAME}`} description="Formulario para iniciar sesión" />

      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
