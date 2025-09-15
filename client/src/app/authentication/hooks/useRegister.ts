import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useValidations from './useValidations';

import { NewUserInt } from '@common/interfaces';
import { useAuth } from '@/context/Auth.context';

/* ------------------ Code ------------------ */

interface UseRegister {
   registerData: NewUserInt;
   confirmPassword: string;
   isLoading: boolean;
   status: number | undefined;
   message: string | undefined;
   errors: Record<string, string>;
   handleRegister: (e: React.FormEvent) => void;
   handleInputChange: (
      field: keyof NewUserInt
   ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleConfirmPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useRegister = (): UseRegister => {
   const [confirmPassword, setConfirmPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [status, setStatus] = useState<number>();
   const [message, setMessage] = useState<string>();
   const [messageId, setMessageId] = useState(0);

   const navigate = useNavigate();
   const { register } = useAuth();

   const [registerData, setRegisterData] = useState<NewUserInt>({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
   });

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
         {
            password: registerData.password,
         }
      );
   };

   const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateRegister()) {
         setMessage('');
         setMessageId((id) => id + 1);
         return;
      }

      setIsLoading(true);

      const res = await register({
         ...registerData,
         name: registerData.name.trim(),
         email: registerData.email.trim(),
         username: registerData.username.trim(),
         phone: registerData.phone.trim(),
      });

      setMessage(res.message);
      setStatus(res.status);
      setMessageId((id) => id + 1);

      if (res.status === 200) {
         setTimeout(() => {
            navigate('/');
         }, 2000);
      }

      setIsLoading(false);
   };

   const handleInputChange =
      (field: keyof NewUserInt) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

   const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      status,
      message,
      errors,
      handleRegister,
      handleInputChange,
      handleConfirmPassword,
   };
};

export default useRegister;
