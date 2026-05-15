import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CiudadaniaDigitalIcon, EyeCloseIcon, EyeIcon, MicrosoftIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "../../hooks/auth/useAuth";
import { ROUTES } from "../../constants/routes.constants";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? "Credenciales incorrectas");
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-4 sm:mb-7">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
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
                    Correo electrónico <span className="text-error-500">*</span>{" "}
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
                        Contraseña <span className="text-error-500">*</span>{" "}
                      </Label>
                    </div>
                    <Link
                        to="/restablecer"
                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-error-500">{error}</p>
                )}
                <div className="flex items-center gap-3">
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mb-2 sm:mb-5">
              <div className="flex items-center py-3 sm:py-5">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
                <span className="px-4 text-sm text-gray-400">
                O
              </span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="flex flex-col gap-3 w-full ">
                <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                  <MicrosoftIcon width="20" height="20" />
                  Ingresa con tu correo institucional
                </button>
                <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
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
