import React from 'react';
import { motion } from 'framer-motion';

import { Input, Button } from '@ui/index.ui';
import { useResetPassword } from '../index';

const ResetPasswordForm: React.FC = () => {
  const {
    newPassword,
    confirmPassword,
    isLoading,
    resStatus,
    resMessage,
    handleSubmit,
    handleInputChange,
  } = useResetPassword();

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-sm text-secondary-color text-center mb-4">
        Escribe tu contraseña nueva para restablecer el acceso a tu cuenta.
      </p>

      <Input
        type="password"
        placeholder="Nueva contraseña"
        icon="FaLock"
        value={newPassword}
        onChange={handleInputChange('newPassword')}
        disabled={isLoading}
      />

      <Input
        type="password"
        placeholder="Confirma tu contraseña"
        icon="FaLock"
        value={confirmPassword}
        onChange={handleInputChange('confirmPassword')}
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full text-md py-3 shadow-medium hover:shadow-strong transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : 'Guardar contraseña'}
      </Button>

      {resMessage && (
        <div
          className={`w-full px-4 py-3 rounded-md text-center text-sm font-medium shadow-soft ${
            resStatus === 200
              ? 'bg-success-light text-success border border-success'
              : 'bg-error-light text-error border border-error'
          }`}
        >
          {resMessage}
        </div>
      )}
    </motion.form>
  );
};

export default ResetPasswordForm;