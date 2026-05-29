import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { useAuth } from '../../hooks/auth/useAuth';
import { ROUTES } from '../../constants/routes.constants';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(email);
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? 'Correo electronico incorrecto');
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 sm:mb-7">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Introduce la dirección de correo electrónico asociada a tu cuenta y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo electrónico <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@adm.emi.edu.bo"
                  />
                </div>

                {error && <p className="text-error-500 text-sm">{error}</p>}
                <div className="flex items-center gap-3">
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? 'Enviando enlace de reinicio...' : 'Enviar enlace de reinicio'}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                ¿Recordaste tu contraseña? {''}
                <Link to="/iniciar-sesion" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Iniciar sesion
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
