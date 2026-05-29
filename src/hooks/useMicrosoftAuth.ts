import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';

export function useMicrosoftAuth() {
  const { instance } = useMsal();

  const loginWithMicrosoft = async (): Promise<void> => {
    const accounts = instance.getAllAccounts();

    if (accounts.length > 0) {
      // Ya tiene sesión — ir directo al callback page
      window.location.href = '/msal-callback';
    } else {
      // Sin sesión — redirigir a Microsoft
      await instance.loginRedirect(loginRequest);
    }
  };

  return { loginWithMicrosoft };
}
