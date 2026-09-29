import { useState } from 'react';

import * as services from '@services/Auth.services';

interface UseChangePasswordReturn {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  resStatus?: number;
  resMessage?: string;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleInputChange: (
    field: 'currentPassword' | 'newPassword' | 'confirmPassword'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useChangePassword = (): UseChangePasswordReturn => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resStatus, setStatus] = useState<number>();
  const [resMessage, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange =
    (field: 'currentPassword' | 'newPassword' | 'confirmPassword') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\s/g, '');
      if (field === 'currentPassword') setCurrentPassword(value);
      else if (field === 'newPassword') setNewPassword(value);
      else setConfirmPassword(value);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setStatus(400);
      return;
    }
    setIsLoading(true);
    try {
      const request = await services.changePassword({ currentPassword, newPassword });
      setMessage(request.message);
      setStatus(request.status);
    } catch (error) {
      setMessage('Error inesperado al cambiar la contraseña');
      setStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    isLoading,
    resStatus,
    resMessage,
    handleSubmit,
    handleInputChange,
  };
};

export default useChangePassword;