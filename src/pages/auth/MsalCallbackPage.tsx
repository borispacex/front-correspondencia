import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth';
import { loginWithMicrosoftToken } from '../../services/social-auth.service';
import { setToken } from '../../utils/token.utils';
import { ROUTES } from '../../constants/routes.constants';
import { loginRequest } from '../../config/msalConfig';

export default function MsalCallbackPage() {
  const { instance } = useMsal();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo ejecutar si venimos de un redirect de Microsoft
    if (!sessionStorage.getItem('msal_login_pending')) {
      navigate(ROUTES.SIGN_IN);
      return;
    }

    async function process() {
      try {
        sessionStorage.removeItem('msal_login_pending');

        await instance.handleRedirectPromise();

        const accounts = instance.getAllAccounts();
        if (accounts.length === 0) {
          navigate(ROUTES.SIGN_IN);
          return;
        }

        const silent = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        const data = await loginWithMicrosoftToken(silent.idToken);
        setToken(data.access_token);
        await refreshUser();
        navigate(ROUTES.HOME);
      } catch (err) {
        console.error('Error en callback:', err);
        navigate(ROUTES.SIGN_IN);
      }
    }

    process();
  }, [instance, navigate, refreshUser]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ color: '#666', fontSize: '14px' }}>Autenticando con Microsoft...</p>
    </div>
  );
}
