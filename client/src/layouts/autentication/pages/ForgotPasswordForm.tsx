import React from 'react';
import { motion } from 'framer-motion';

import { Input, Button } from '@ui/index.ui';
import { useForgotPassword } from '../index';

const ForgotPasswordForm: React.FC = () => {
  const {
    email,
    isLoading,
    resStatus,
    resMessage,
    handleSubmit,
    handleEmailChange,
  } = useForgotPassword();

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
        Escribe el correo registrado en tu cuenta y te enviaremos un enlace
        para restablecer tu contraseña.
      </p>

      <Input
        type="email"
        placeholder="Escribe tu email"
        icon="FaEnvelope"
        value={email}
        onChange={handleEmailChange}
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full text-md py-3 shadow-medium hover:shadow-strong transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar enlace'}
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

export default ForgotPasswordForm;