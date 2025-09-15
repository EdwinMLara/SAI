import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';
import { UserCredentialsInt } from '@common/interfaces';

/* ------------------ Code ------------------ */

interface UseLogin {
   loginData: UserCredentialsInt;
   isLoading: boolean;
   status: number | undefined;
   message: string | undefined;
   handleLogin: (event: React.FormEvent) => Promise<void>;
   handleInputChange: (
      field: keyof UserCredentialsInt
   ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useLogin = () => {
   const [status, setStatus] = useState<number>();
   const [message, setMessage] = useState<string>();
   const [isLoading, setIsLoading] = useState<boolean>();

   const navigate = useNavigate();
   const location = useLocation();
   const { login } = useAuth();

   const [loginData, setLoginData] = useState<UserCredentialsInt>({
      email: '',
      password: '',
   });

   const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      const res = await login(loginData);

      setMessage(res.message);
      setStatus(res.status);

      if (res.status === 200) {
         const from = location.state?.from?.pathname || '/';
         navigate(from);
      }

      setIsLoading(false);
   };

   const handleInputChange =
      (field: keyof UserCredentialsInt) =>
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
      status,
      message,
      handleLogin,
      handleInputChange,
   };
};

export default useLogin;
