import React, { useState } from 'react';
import { PublicUserInt } from '@common/interfaces';
import { useAuth } from '@/context/Auth.context';
import { Icon, Button } from '@ui/index';
import Select from '@ui/Select';
import { changeUserRole } from '@/core/services/User.services';

interface UserCardProps {
   user: PublicUserInt;
   className?: string;
}

function UserCard({ user, className = '' }: UserCardProps) {
   const { user: currentUser } = useAuth();
   const [imageError, setImageError] = useState(false);
   const [isChangingRole, setIsChangingRole] = useState(false);
   const [showDetails, setShowDetails] = useState(false);
   const isCurrentUser = currentUser?._id === user._id;

   const handleImageError = () => {
      setImageError(true);
   };

   const handleRoleChange = async (
      newRole: string | number | (string | number)[]
   ) => {
      if (isCurrentUser) return;

      let roleValue: string;
      if (Array.isArray(newRole)) {
         roleValue = String(newRole[0]);
      } else {
         roleValue = String(newRole);
      }

      if (roleValue === user.role) return;
      if (roleValue !== 'admin' && roleValue !== 'user') return;

      setIsChangingRole(true);
      try {
         const response = await changeUserRole({
            userId: user._id,
            newRole: roleValue as 'admin' | 'user',
         });
         if (response.success) {
            console.log(
               `Rol de ${user.name} cambiado exitosamente a ${roleValue}`
            );
            // TODO: Actualizar el estado local o refrescar la lista de usuarios
         }
      } catch (error) {
         console.error('Error al cambiar rol:', error);
      } finally {
         setIsChangingRole(false);
      }
   };

   return (
      <div
         className={`bg-card rounded-lg shadow-sm border border-light p-4 hover:shadow-md transition-shadow duration-200 ${className}`}
      >
         <div className="flex items-center space-x-4">
            {/* Avatar del usuario */}
            <div className="flex-shrink-0">
               {user.image && !imageError ? (
                  <img
                     src={user.image}
                     alt={user.name}
                     className="h-12 w-12 rounded-full object-cover ring-2 ring-secondary"
                     onError={handleImageError}
                  />
               ) : (
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                     <Icon
                        name="FaUser"
                        size="20"
                        className="text-muted-color"
                     />
                  </div>
               )}
            </div>

            <div className="flex-1 min-w-0">
               {/* Nombre completo y usuario actual */}
               <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-primary-color truncate">
                     {user.name}
                  </h3>
                  {isCurrentUser && (
                     <span className="text-xs text-brand font-medium px-2 py-1 bg-brand-light rounded">
                        (tú)
                     </span>
                  )}
               </div>

               {/* Nombre de usuario */}
               <p className="text-sm text-secondary-color">@{user.username}</p>
            </div>

            {/* Selector de rol */}
            <div className="flex-shrink-0 relative">
               {currentUser?.role === 'admin' && !isCurrentUser ? (
                  <Select
                     value={user.role}
                     onChange={handleRoleChange}
                     options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'user', label: 'Usuario' },
                     ]}
                     disabled={isChangingRole}
                     className="w-24 text-xs z-10"
                     placeholder="Rol"
                  />
               ) : (
                  <span
                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                           ? 'bg-vibrant-purple-light'
                           : 'bg-info-light'
                     }`}
                  >
                     {user.role === 'admin' ? 'Admin' : 'Usuario'}
                  </span>
               )}
            </div>

            {/* Botón de más detalles */}
            <div className="flex-shrink-0">
               <Button
                  variant="ghost"
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2"
               >
                  <Icon
                     name={showDetails ? 'FaChevronUp' : 'FaChevronDown'}
                     size="14"
                  />
               </Button>
            </div>
         </div>

         {/* Información detallada (colapsable) */}
         {showDetails && (
            <div className="mt-4 pt-4 border-t border-light space-y-2">
               <div className="flex items-center text-sm text-muted-color">
                  <Icon name="FaEnvelope" size="12" className="mr-2" />
                  <span className="truncate">{user.email}</span>
               </div>
               {user.phone && (
                  <div className="flex items-center text-sm text-muted-color">
                     <Icon name="FaPhone" size="12" className="mr-2" />
                     <span>{user.phone}</span>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

export default UserCard;
