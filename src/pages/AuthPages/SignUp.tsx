import AuthLayout from './AuthPageLayout';
import SignUpForm from '../../components/auth/SignUpForm';
import PageMeta from '../../components/common/PageMeta.tsx';
import { APP_NAME } from '../../components/correspondence/constants/correspondence.constants.ts';

export default function SignUp() {
  return (
    <>
      <PageMeta title={`Registrarse | ${APP_NAME}`} description="Formulario para registrarse" />

      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
