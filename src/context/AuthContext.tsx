import { useState, useEffect, type ReactNode } from "react";
import type { AuthUser, LoginRequest } from "../types/auth/auth.types";
import { AuthContext } from "./auth-context";
import { login as loginService, logout as logoutService, me as meService } from "../services/auth.service";
import { loginWithMicrosoftToken } from "../services/social-auth.service";
import { getToken, setToken, removeToken } from "../utils/token.utils";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/msalConfig";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { instance } = useMsal();
  const storedToken = getToken();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(storedToken);
  const [isLoading, setIsLoading] = useState(!!storedToken);

  // Restore auth state and user profile from localStorage on mount
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setIsLoading(true);
      refreshUser()
          .finally(() => setIsLoading(false));
    }
  }, []);

  async function login(credentials: LoginRequest): Promise<void> {
    setIsLoading(true);
    try {
      const response = await loginService(credentials);
      setToken(response.access_token);
      setTokenState(response.access_token);
      // Fetch user profile after login
      try {
        const profile = await meService();
        setUser(profile);
      } catch {
        // me() endpoint may not exist yet — login still succeeds
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(): Promise<void> {
    setIsLoading(true);
    try {
      await logoutService();
    } catch {
      // Ignore logout errors — clear state regardless
    } finally {
      removeToken();
      setTokenState(null);
      setUser(null);
      setIsLoading(false);
    }
  }

  async function refreshUser(): Promise<void> {
    try {
      const profile = await meService();
      setUser(profile);
    } catch {
      setUser(null);
    }
  }

  async function loginWithMicrosoft(): Promise<void> {
    setIsLoading(true);
    try {
      const accounts = instance.getAllAccounts();

      if (accounts.length > 0) {
        try {
          const silent = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const data = await loginWithMicrosoftToken(silent.idToken);
          setToken(data.access_token);
          setTokenState(data.access_token);
          try {
            const profile = await meService();
            setUser(profile);
          } catch {}
        } catch (silentError) {
          console.error('Error token silencioso:', silentError);
          // Si falla el silencioso, redirigir a Microsoft
          sessionStorage.setItem('msal_login_pending', '1');
          await instance.loginRedirect(loginRequest);
          return;
        }
      } else {
        sessionStorage.setItem('msal_login_pending', '1');
        await instance.loginRedirect(loginRequest);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshUser,
        loginWithMicrosoft,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
