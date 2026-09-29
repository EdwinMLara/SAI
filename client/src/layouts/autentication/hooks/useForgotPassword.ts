import { useState } from 'react';

import * as services from '@services/Auth.services';

interface UseForgotPasswordReturn {
  email: string;
  isLoading: boolean;
  resStatus?: number;
  resMessage?: string;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useForgotPassword = (): UseForgotPasswordReturn => {
  const [email, setEmail] = useState('');
  const [resStatus, setStatus] = useState<number>();
  const [resMessage, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.replace(/\s/g, ''));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const request = await services.forgotPassword({ email });
      setMessage(request.message);
      setStatus(request.status);
    } catch (error) {
      setMessage('Error inesperado al solicitar la recuperación');
      setStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isLoading,
    resStatus,
    resMessage,
    handleSubmit,
    handleEmailChange,
  };
};

export default useForgotPassword;