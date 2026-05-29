import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CiudadaniaDigitalIcon, EyeCloseIcon, EyeIcon, MicrosoftIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { useAuth } from '../../hooks/auth/useAuth';
import { ROUTES } from '../../constants/routes.constants';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithMicrosoft, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? 'Credenciales incorrectas');
    }
  }

  const handleClick = async () => {
    setError(null);
    try {
      await loginWithMicrosoft();

      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      console.error('Error COMPLETO:', err);
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? 'Error al iniciar sesión con Microsoft');
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 sm:mb-7">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo y contraseña para iniciar sesión.
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
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Label>
                        Contraseña <span className="text-error-500">*</span>{' '}
                      </Label>
                    </div>
                    <Link to="/restablecer" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {error && <p className="text-error-500 text-sm">{error}</p>}
                <div className="flex items-center gap-3">
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mb-2 sm:mb-5">
              <div className="flex items-center py-3 sm:py-5">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
                <span className="px-4 text-sm text-gray-400">O</span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={handleClick}
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <MicrosoftIcon width="20" height="20" />
                  Ingresa con tu correo institucional
                </button>
                <button className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                  <CiudadaniaDigitalIcon width="20" height="20" />
                  Ingresa con tu Ciudadanía
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
