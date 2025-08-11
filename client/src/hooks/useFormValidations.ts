const formatPhone = (input: string): string => {
  const digits = input.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};
import { useState, useCallback } from 'react';

interface ValidationRules {
  name?: boolean;
  username?: boolean;
  email?: boolean;
  phone?: boolean;
  password?: boolean;
  confirmPassword?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateName = useCallback((value: string): string => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return 'El nombre es requerido';
    }

    if (trimmedValue.length < 5) {
      return 'El nombre debe tener nombre y apellido';
    } else if (trimmedValue.length > 30) {
      return 'El nombre es demasiado largo';
    }

    const nameRegex =
      /^([A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+)(\s[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+)*$/;
    if (!nameRegex.test(trimmedValue)) {
      return 'Formato de nombre no válido';
    }

    return '';
  }, []);

  const validateUsername = useCallback((value: string): string => {
    const upperValue = value.toUpperCase();

    if (!upperValue) {
      return 'El nombre de usuario es requerido';
    }

    if (upperValue.length !== 4) {
      return 'El nombre de usuario debe tener exactamente 4 letras';
    }

    const usernameRegex = /^[A-Z]{4}$/;
    if (!usernameRegex.test(upperValue)) {
      return 'El nombre de usuario solo puede contener 4 letras';
    }

    return '';
  }, []);

  const validateEmail = useCallback((value: string): string => {
    if (!value) {
      return 'El email es requerido';
    }
    if (value.includes(' ')) {
      return 'El email no puede contener espacios';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'El email no es válido';
    }
    return '';
  }, []);

  const validatePhone = useCallback((value: string): string => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return 'El teléfono es requerido';
    }

    // Solo dígitos, exactamente 10
    const digits = trimmedValue.replace(/\D/g, '');
    if (digits.length !== 10) {
      return 'El teléfono debe tener exactamente 10 dígitos';
    }

    return '';
  }, []);

  const validatePassword = useCallback((value: string): string => {
    if (!value) {
      return 'La contraseña es requerida';
    }
    if (value.includes(' ')) {
      return 'La contraseña no puede contener espacios';
    }
    if (value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }, []);

  const validateConfirmPassword = useCallback(
    (value: string, password: string): string => {
      if (!value) {
        return 'Confirma tu contraseña';
      }

      if (value !== password) {
        return 'Las contraseñas no coinciden';
      }

      return '';
    },
    []
  );

  const formatName = useCallback((value: string): string => {
    // Permite espacios iniciales y un solo espacio entre palabras
    return value.replace(/\s{2,}/g, ' ');
  }, []);

  const formatUsername = useCallback((value: string): string => {
    const alphabeticOnly = value.replace(/[^a-zA-Z]/g, '');
    return alphabeticOnly.slice(0, 4).toUpperCase();
  }, []);

  const processName = useCallback((value: string): string => {
    // No elimina espacios iniciales para permitirlos en el input
    return value;
  }, []);

  const validateField = useCallback(
    (
      fieldName: string,
      value: string,
      rules: ValidationRules = {},
      additionalData?: { password?: string }
    ): string => {
      let error = '';

      switch (fieldName) {
        case 'name':
          if (rules.name) {
            error = validateName(value);
          }
          break;
        case 'username':
          if (rules.username) {
            error = validateUsername(value);
          }
          break;
        case 'email':
          if (rules.email) {
            error = validateEmail(value);
          }
          break;
        case 'phone':
          if (rules.phone) {
            error = validatePhone(value);
          }
          break;
        case 'password':
          if (rules.password) {
            error = validatePassword(value);
          }
          break;
        case 'confirmPassword':
          if (rules.confirmPassword && additionalData?.password) {
            error = validateConfirmPassword(value, additionalData.password);
          }
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));

      return error;
    },
    [
      validateName,
      validateUsername,
      validateEmail,
      validatePhone,
      validatePassword,
      validateConfirmPassword,
    ]
  );

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: '',
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateForm = useCallback(
    (
      data: Record<string, string>,
      rules: ValidationRules,
      additionalData?: { password?: string }
    ): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      Object.keys(data).forEach((fieldName) => {
        const error = validateField(
          fieldName,
          data[fieldName],
          rules,
          additionalData
        );
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [validateField]
  );

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    formatName,
    formatUsername,
    processName,
    formatPhone,
  };
};
