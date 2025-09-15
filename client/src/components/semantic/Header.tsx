import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/Auth.context';
import { useSidebar } from '@context/Sidebar.context';

import { Logo } from '../helpers/Brand';
import { useNavigate } from 'react-router-dom';
import { Icon, IconButton } from '@ui/index';
import ThemeToggle from '../helpers/ToggleTheme';

const Header: React.FC = () => {
   const navigate = useNavigate();
   const { user, logout } = useAuth();
   const { toggle } = useSidebar();

   const [userImageError, setUserImageError] = useState(false);

   useEffect(() => {
      setUserImageError(false);
   }, [user?.image]);

   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
   const [isNotificationOpen, setIsNotificationOpen] = useState(false);

   const userMenuRef = useRef<HTMLDivElement>(null);
   const notificationRef = useRef<HTMLDivElement>(null);

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
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleLogout = async () => {
      await logout();
      setIsUserMenuOpen(false);
   };

   return (
      <header className="bg-card border-light shadow-soft">
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
                  <Logo className="h-8 w-auto" />
               </div>
            </div>

            <div className="flex items-center gap-4">
               <ThemeToggle />
               {user && (
                  <div className="relative" ref={userMenuRef}>
                     <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 p-2 rounded-md hover-bg-secondary transition-colors"
                     >
                        <div className="hidden sm:block text-right">
                           <p className="text-sm font-medium text-primary-color">
                              {user.name}
                           </p>
                           <p className="text-xs text-secondary-color capitalize">
                              {user.role === 'admin'
                                 ? 'Administrador'
                                 : 'Usuario'}
                           </p>
                        </div>

                        <div className="relative">
                           <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-light">
                              {user.image && !userImageError ? (
                                 <img
                                    src={user.image}
                                    alt={`Foto de ${user.name}`}
                                    className="w-full h-full object-cover"
                                    onError={() => setUserImageError(true)}
                                 />
                              ) : (
                                 <div className="w-full h-full bg-accent flex items-center justify-center">
                                    <Icon
                                       name="FaUser"
                                       size={20}
                                       className="text-primary-color"
                                    />
                                 </div>
                              )}
                           </div>
                        </div>

                        <Icon
                           name="FaChevronDown"
                           size={12}
                           className={`text-secondary-color transition-transform ${
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
                              className="absolute right-0 mt-2 w-56 bg-card border border-light shadow-medium rounded-md z-50"
                           >
                              <div className="p-3 border-b border-light">
                                 <p className="text-sm font-medium text-primary-color">
                                    {user.name}
                                 </p>
                                 <p className="text-xs text-secondary-color">
                                    {user.email}
                                 </p>
                              </div>

                              <div className="p-2">
                                 <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-primary-color hover-bg-secondary rounded-md transition-colors"
                                    onClick={() => navigate('/profile')}
                                 >
                                    <Icon
                                       name="FaUser"
                                       size={16}
                                       className="text-secondary-color"
                                    />
                                    Mi perfil
                                 </button>

                                 <div className="border-t border-light my-2"></div>

                                 <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error-light rounded-md transition-colors"
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
