import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@context/Auth.context';
import { UserCredentials } from '@interfaces/User.interfaces';

interface UseLoginReturn {
  loginData: UserCredentials;
  isLoading: boolean;
  resStatus?: number;
  resMessage?: string;
  handleLogin: (event: React.FormEvent) => Promise<void>;
  handleLoginInputChange: (
    field: keyof UserCredentials
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useLogin = (): UseLoginReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState<UserCredentials>({
    email: '',
    password: '',
  });

  const [resStatus, setStatus] = useState<number>();
  const [resMessage, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const request = await login(loginData);
      setMessage(request.message);
      setStatus(request.status);

      if (request.status === 200) {
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }, 2000);
      }
    } catch (error) {
      setMessage('Error inesperado durante el inicio de sesión');
      setStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange =
    (field: keyof UserCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (field === 'email' || field === 'password') {
        value = value.replace(/\s/g, '');
      }

      setLoginData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  return {
    loginData,
    isLoading,
    resStatus,
    resMessage,
    handleLogin,
    handleLoginInputChange,
  };
};

export default useLogin;
