import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Input, Button } from '@ui/index.ui';
import { useAuth } from '@/context/Auth.context';
import { UserCredentials } from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [resStatus, setStatus] = useState<number>();
  const [resMessage, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<UserCredentials>({
    email: '',
    password: '',
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const request = await login(loginData);
    setMessage(request.message);
    setStatus(request.status);
    if (request.status === 200) {
      setTimeout(() => {
        // Redirigir a la ruta de origen o a la raíz como fallback
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }, 2000);
    }
    setIsLoading(false);
  };

  const handleLoginInputChange =
    (field: keyof UserCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === 'email' || field === 'password') {
        value = value.replace(/\s/g, '');
      }
      setLoginData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="login"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <motion.form
          onSubmit={handleLogin}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Input
              type="email"
              placeholder="Escribe tu email"
              icon="FaEnvelope"
              value={loginData.email}
              onChange={handleLoginInputChange('email')}
              disabled={isLoading}
            ></Input>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              type="password"
              placeholder="Escribe tu contraseña"
              icon="FaLock"
              value={loginData.password}
              onChange={handleLoginInputChange('password')}
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              variant="primary"
              className="w-full text-md py-3 shadow-medium hover:shadow-strong transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </motion.div>
        </motion.form>
        {resMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-center pt-4"
          >
            <div
              className={`w-full max-w-md px-4 py-3 rounded-md text-center text-sm font-medium shadow-soft transition-all duration-300
                ${
                  resStatus === 200
                    ? 'bg-success-light text-success border border-success'
                    : ''
                }
                ${
                  resStatus !== 200
                    ? 'bg-error-light text-error border border-error'
                    : ''
                }
              `}
            >
              {resMessage}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
