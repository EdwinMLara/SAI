import React from 'react';
import { motion } from 'framer-motion';

import { ChangePasswordForm } from '@layouts/autentication/index';

const ChangePassword = () => {
  return (
    <div className="p-6">
      <motion.div
        className="max-w-md mx-auto bg-card p-6 rounded-md shadow-medium border border-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-primary-color mb-2">
          Cambiar contraseña
        </h1>
        <p className="text-secondary-color mb-6">
          Actualiza la contraseña de tu cuenta
        </p>
        <ChangePasswordForm />
      </motion.div>
    </div>
  );
};

export default ChangePassword;