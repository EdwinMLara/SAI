import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@context/Auth.context';
import { useSidebar } from '@context/Sidebar.context';
import Icon from '@ui/Icon';
import IconButton from '@ui/IconButton';
import navigationItems, { NavigationItem } from './items';

/* ------------------ Code ------------------ */

const Sidebar: React.FC = () => {
   const { user } = useAuth();
   const location = useLocation();

   const { isOpen, toggle, close } = useSidebar();
   useEffect(() => {
      if (isOpen) {
         toggle();
      }
   }, []);
   const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const handleLinkClick = () => {
      if (isMobile) {
         close();
      }
   };

   const isAdmin = user?.role === 'admin';

   const filteredItems = navigationItems.filter((item) => {
      if (item.adminOnly && !isAdmin) return false;
      return true;
   });

   const isActiveRoute = (path: string) => {
      if (path === '/') {
         return location.pathname === '/';
      }
      return location.pathname.startsWith(path);
   };

   const toggleExpanded = (itemId: string) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(itemId)) {
         newExpanded.delete(itemId);
      } else {
         newExpanded.add(itemId);
      }
      setExpandedItems(newExpanded);
   };

   const hasActiveSubItem = (item: NavigationItem) => {
      if (!item.subItems) return false;
      return item.subItems.some((subItem) => isActiveRoute(subItem.path));
   };

   const sidebarVariants = {
      open: {
         width: '250px',
         transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 30,
         },
      },
      closed: {
         width: '80px',
         transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 30,
         },
      },
   };

   const contentVariants = {
      open: {
         opacity: 1,
         x: 0,
         transition: {
            delay: 0.1,
            duration: 0.2,
         },
      },
      closed: {
         opacity: 0,
         x: -20,
         transition: {
            duration: 0.1,
         },
      },
   };

   const iconOnlyVariants = {
      open: {
         opacity: 0,
         scale: 0.8,
         transition: {
            duration: 0.1,
         },
      },
      closed: {
         opacity: 1,
         scale: 1,
         transition: {
            delay: 0.1,
            duration: 0.2,
         },
      },
   };

   return (
      <>
         <AnimatePresence>
            {isOpen && isMobile && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-30 md:hidden"
                  onClick={close}
               />
            )}
         </AnimatePresence>

         <motion.aside
            variants={sidebarVariants}
            animate={isOpen ? 'open' : 'closed'}
            className={`fixed left-0 top-0 h-full bg-card rounded-l-none border-light shadow-medium z-40 flex flex-col ${
               isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''
            }`}
         >
            {/* Header del Sidebar */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-light">
               <AnimatePresence mode="wait">
                  {isOpen && (
                     <motion.div
                        key="logo-text"
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="flex items-center gap-3"
                     >
                        <span className="text-primary-color font-bold text-md">
                           Administrador
                        </span>
                     </motion.div>
                  )}
               </AnimatePresence>

               <IconButton
                  icon={isOpen ? 'FaChevronLeft' : 'FaChevronRight'}
                  variant="ghost"
                  className="p-2"
                  onClick={toggle}
                  title={isOpen ? 'Contraer sidebar' : 'Expandir sidebar'}
               />
            </div>

            <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
               <ul className="space-y-2 px-3">
                  {filteredItems.map((item) => {
                     const isActive = isActiveRoute(item.path);
                     const hasSubItems =
                        item.subItems && item.subItems.length > 0;
                     const isExpanded = expandedItems.has(item.id);
                     const hasActiveSub = hasActiveSubItem(item);

                     return (
                        <li key={item.id}>
                           <div className="relative">
                              {hasSubItems ? (
                                 <button
                                    onClick={() => {
                                       if (!isOpen) {
                                          toggle();
                                       }
                                       toggleExpanded(item.id);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${
                                       isOpen
                                          ? ''
                                          : 'justify-center w-12 h-12 p-0'
                                    } ${
                                       isActive || hasActiveSub
                                          ? 'bg-brand-light text-brand border border-brand/20'
                                          : 'text-secondary-color hover-bg-secondary hover:text-primary-color'
                                    }`}
                                 >
                                    <span
                                       className={`${
                                          isOpen
                                             ? ''
                                             : 'flex items-center justify-center w-8 h-8 rounded-md'
                                       } `}
                                    >
                                       <Icon
                                          name={item.iconName}
                                          size={20}
                                          className={`flex-shrink-0 ${
                                             isActive || hasActiveSub
                                                ? 'text-brand'
                                                : 'text-secondary-color'
                                          }`}
                                       />
                                    </span>
                                    <AnimatePresence>
                                       {isOpen && (
                                          <motion.div
                                             variants={contentVariants}
                                             initial="closed"
                                             animate="open"
                                             exit="closed"
                                             className="flex items-center justify-between flex-1"
                                          >
                                             <span className="font-medium text-sm text-primary-color">
                                                {item.label}
                                             </span>
                                             <Icon
                                                name="FaChevronDown"
                                                size={12}
                                                className={`transition-transform duration-200 ${
                                                   isExpanded
                                                      ? 'rotate-180'
                                                      : ''
                                                } ${
                                                   isActive || hasActiveSub
                                                      ? 'text-brand'
                                                      : 'text-secondary-color'
                                                }`}
                                             />
                                          </motion.div>
                                       )}
                                    </AnimatePresence>
                                 </button>
                              ) : (
                                 <Link
                                    to={item.path}
                                    onClick={() => {
                                       handleLinkClick();
                                       close();
                                    }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${
                                       isOpen
                                          ? ''
                                          : 'justify-center w-12 h-12 p-0'
                                    } ${
                                       isActive
                                          ? 'bg-brand-light text-brand border border-brand/20'
                                          : 'text-primary-color hover-bg-secondary hover:text-primary-color'
                                    }`}
                                 >
                                    <span
                                       className={`${
                                          isOpen
                                             ? ''
                                             : 'flex items-center justify-center w-8 h-8 rounded-md'
                                       } `}
                                    >
                                       <Icon
                                          name={item.iconName}
                                          size={20}
                                          className={`flex-shrink-0 ${
                                             isActive
                                                ? 'text-brand'
                                                : 'text-secondary-color'
                                          }`}
                                       />
                                    </span>

                                    <AnimatePresence>
                                       {isOpen && (
                                          <motion.span
                                             variants={contentVariants}
                                             initial="closed"
                                             animate="open"
                                             exit="closed"
                                             className="font-medium text-sm"
                                          >
                                             {item.label}
                                          </motion.span>
                                       )}
                                    </AnimatePresence>
                                 </Link>
                              )}
                           </div>

                           <AnimatePresence>
                              {hasSubItems && isExpanded && isOpen && (
                                 <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-2 ml-6 space-y-1 overflow-hidden"
                                 >
                                    {item
                                       .subItems!.filter(
                                          (subItem) =>
                                             !subItem.adminOnly || isAdmin
                                       )
                                       .map((subItem) => {
                                          const isSubActive = isActiveRoute(
                                             subItem.path
                                          );
                                          return (
                                             <li key={subItem.id}>
                                                <Link
                                                   to={subItem.path}
                                                   onClick={() => {
                                                      handleLinkClick();
                                                      close();
                                                   }}
                                                   className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                                      isSubActive
                                                         ? 'bg-brand-light text-brand border border-brand/20'
                                                         : 'text-secondary-color hover-bg-secondary hover:text-primary-color'
                                                   }`}
                                                >
                                                   <div
                                                      className={`w-1.5 h-1.5 rounded-full ${
                                                         isSubActive
                                                            ? 'bg-brand'
                                                            : 'bg-secondary'
                                                      }`}
                                                   />
                                                   <span className="font-medium">
                                                      {subItem.label}
                                                   </span>
                                                </Link>
                                             </li>
                                          );
                                       })}
                                 </motion.ul>
                              )}
                           </AnimatePresence>
                        </li>
                     );
                  })}
               </ul>
            </nav>

            <div className="p-4 border-t border-light">
               <AnimatePresence>
                  {isOpen ? (
                     <motion.div
                        key="user-info"
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="flex items-center gap-3"
                     >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-light">
                           {user?.image ? (
                              <img
                                 src={user.image}
                                 alt={`Foto de ${user.name}`}
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <div className="w-full h-full bg-accent flex items-center justify-center">
                                 <span className="text-primary-color text-sm font-medium">
                                    {user?.name?.charAt(0)}
                                 </span>
                              </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-primary-color text-sm font-medium truncate">
                              {user?.name}
                           </p>
                           <p className="text-secondary-color text-xs truncate">
                              {user?.role === 'admin'
                                 ? 'Administrador'
                                 : 'Usuario'}
                           </p>
                        </div>
                     </motion.div>
                  ) : (
                     <motion.div
                        key="user-icon"
                        variants={iconOnlyVariants}
                        initial="open"
                        animate="closed"
                        exit="open"
                        className="flex justify-center"
                     >
                        <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border border-light group cursor-pointer relative">
                           {user?.image ? (
                              <img
                                 src={user.image}
                                 alt={`Foto de ${user.name}`}
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <div className="w-full h-full bg-accent flex items-center justify-center">
                                 <span className="text-primary-color text-sm font-medium">
                                    {user?.name?.charAt(0)}
                                 </span>
                              </div>
                           )}

                           <div className="absolute left-full ml-2 px-2 py-1 bg-elevated rounded-md shadow-medium text-xs font-medium text-primary-color opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                              {user?.name}
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </motion.aside>
      </>
   );
};

export default Sidebar;
