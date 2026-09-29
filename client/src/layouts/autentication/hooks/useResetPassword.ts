import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import * as services from '@services/Auth.services';

interface UseResetPasswordReturn {
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  resStatus?: number;
  resMessage?: string;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleInputChange: (
    field: 'newPassword' | 'confirmPassword'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useResetPassword = (): UseResetPasswordReturn => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resStatus, setStatus] = useState<number>();
  const [resMessage, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange =
    (field: 'newPassword' | 'confirmPassword') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\s/g, '');
      if (field === 'newPassword') setNewPassword(value);
      else setConfirmPassword(value);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      setMessage('El enlace de recuperación no es válido');
      setStatus(400);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setStatus(400);
      return;
    }
    setIsLoading(true);
    try {
      const request = await services.resetPassword({ token, newPassword });
      setMessage(request.message);
      setStatus(request.status);
    } catch (error) {
      setMessage('Error inesperado al restablecer la contraseña');
      setStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newPassword,
    confirmPassword,
    isLoading,
    resStatus,
    resMessage,
    handleSubmit,
    handleInputChange,
  };
};

export default useResetPassword;