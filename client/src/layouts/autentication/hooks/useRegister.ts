import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@context/Auth.context';
import { NewUser } from '@interfaces/User.interfaces';
import { useValidations } from '../index';

interface UseRegisterReturn {
  registerData: NewUser;
  confirmPassword: string;
  isLoading: boolean;
  resStatus?: number;
  resMessage?: string;
  errors: Record<string, string>;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  handleRegisterInputChange: (
    field: keyof NewUser
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useRegister = (): UseRegisterReturn => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [registerData, setRegisterData] = useState<NewUser>({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resStatus, setStatus] = useState<number>();
  const [resMessage, setMessage] = useState<string>();

  const {
    errors,
    validateForm,
    clearError,
    formatName,
    formatUsername,
    processName,
    formatPhone,
  } = useValidations();

  const validateRegister = (): boolean => {
    const formData = {
      name: registerData.name,
      username: registerData.username,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      confirmPassword: confirmPassword,
    };

    return validateForm(
      formData,
      {
        name: true,
        username: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: registerData.password,
      },
      { password: registerData.password }
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegister()) {
      setMessage('');
      return;
    }

    setIsLoading(true);

    try {
      const request = await register({
        ...registerData,
        name: registerData.name.trim(),
        username: registerData.username.trim(),
        phone: registerData.phone.trim(),
      });

      setMessage(request.message);
      setStatus(request.status);

      if (request.status === 200) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setMessage('Error inesperado durante el registro');
      setStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterInputChange =
    (field: keyof NewUser) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (field === 'email' || field === 'password') {
        value = value.replace(/\s/g, '');
      }

      if (field === 'name') {
        value = formatName(value);
      } else if (field === 'username') {
        value = formatUsername(value);
      } else if (field === 'phone') {
        value = formatPhone(value);
      }

      setRegisterData((prev) => ({
        ...prev,
        [field]: field === 'name' ? processName(value) : value,
      }));

      if (errors[field]) {
        clearError(field);
      }
    };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\s/g, '');
    setConfirmPassword(value);

    if (errors.confirmPassword) {
      clearError('confirmPassword');
    }
  };

  return {
    registerData,
    confirmPassword,
    isLoading,
    resStatus,
    resMessage,
    errors,
    handleRegister,
    handleRegisterInputChange,
    handleConfirmPasswordChange,
  };
};

export default useRegister;
