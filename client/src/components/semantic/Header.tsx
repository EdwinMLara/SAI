import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@context/Auth.context';
import { useSidebar } from '@context/Sidebar.context';

import Icon from '@ui/Icon';
import IconButton from '@ui/IconButton';
import ThemeToggle from '../helpers/ToggleTheme';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="bg-card-bg border-b border-main shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <IconButton
            icon="FaBars"
            variant="ghost"
            onClick={toggle}
            title="Alternar sidebar"
            className="block md:hidden"
          />

          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-main">Dashboard</h1>
            <p className="text-sm text-gray-500 capitalize">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Icon name="FaClock" size={16} className="text-gray-400" />
            <span className="text-main font-mono">
              {formatTime(currentTime)}
            </span>
          </div>

          <ThemeToggle />

          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-hover transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-main">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </p>
                </div>

                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-secondary">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={`Foto de ${user.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent flex items-center justify-center">
                        <span className="text-placeholder text-sm font-medium">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Icon
                  name="FaChevronDown"
                  size={12}
                  className={`text-gray-400 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-card-bg border border-main rounded-lg shadow-main z-50"
                  >
                    <div className="p-3 border-b border-main">
                      <p className="text-sm font-medium text-main">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-main hover:bg-hover rounded-md transition-colors">
                        <Icon
                          name="FaUser"
                          size={16}
                          className="text-gray-400"
                        />
                        Mi perfil
                      </button>

                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-main hover:bg-hover rounded-md transition-colors">
                        <Icon
                          name="FaCog"
                          size={16}
                          className="text-gray-400"
                        />
                        Configuración
                      </button>

                      <div className="border-t border-main my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <Icon name="FaSignOutAlt" size={16} />
                        Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
