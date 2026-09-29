import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ForgotPasswordForm } from '@layouts/autentication/index';

const ForgotPassword = () => {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-md">
        <div className="bg-card rounded-md shadow-medium backdrop-blur-sm bg-opacity-95 border border-light overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-primary-color mb-2">
                Recuperar contraseña
              </h2>
              <p className="text-sm text-secondary-color">
                Te enviaremos un enlace de recuperación a tu correo
              </p>
            </div>
            <ForgotPasswordForm />
            <div className="text-center pt-4">
              <Link to="/auth" className="text-sm text-brand hover:underline">
                Volver a iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;