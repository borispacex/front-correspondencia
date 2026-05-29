import { useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes.constants.ts';

const useGoBack = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // Go back to the previous page
    } else {
      navigate(ROUTES.HOME); // Redirect to home if no history exists
    }
  };

  return goBack;
};

export default useGoBack;
