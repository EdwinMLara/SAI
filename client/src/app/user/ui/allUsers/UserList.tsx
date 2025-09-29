import React from 'react';
import { PublicUserInt } from '@common/interfaces';
import UserCard from './UserCard';

interface UserListProps {
   users: PublicUserInt[];
   loading?: boolean;
   error?: string | null;
   className?: string;
}

function UserList({
   users,
   loading = false,
   error = null,
   className = '',
}: UserListProps) {
   if (loading) {
      return (
         <div className={`space-y-4 ${className}`}>
            {[...Array(6)].map((_, index) => (
               <div
                  key={index}
                  className="bg-primary rounded-md shadow-sm border border-light p-6 animate-pulse"
               >
                  <div className="flex items-start space-x-4">
                     <div className="h-12 w-12 bg-secondary rounded-full"></div>
                     <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary rounded w-1/4"></div>
                        <div className="h-3 bg-secondary rounded w-1/6"></div>
                        <div className="space-y-1">
                           <div className="h-3 bg-secondary rounded w-1/3"></div>
                           <div className="h-3 bg-secondary rounded w-1/4"></div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div
            className={`bg-error-light border border-error rounded-lg p-6 ${className}`}
         >
            <div className="flex items-center">
               <div className="flex-shrink-0">
                  <div className="w-5 h-5 text-error">
                     <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                           fillRule="evenodd"
                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
               </div>
               <div className="ml-3">
                  <h3 className="text-sm font-medium text-error">
                     Error al cargar usuarios
                  </h3>
                  <p className="text-sm text-error mt-1">{error}</p>
               </div>
            </div>
         </div>
      );
   }

   if (users.length === 0) {
      return (
         <div
            className={`bg-secondary border border-light rounded-lg p-12 text-center ${className}`}
         >
            <div className="w-12 h-12 mx-auto mb-4 text-secondary-color">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
               </svg>
            </div>
            <h3 className="text-lg font-medium text-primary-color mb-2">
               No se encontraron usuarios
            </h3>
            <p className="text-muted-color">
               No hay usuarios que coincidan con los filtros aplicados.
            </p>
         </div>
      );
   }

   return (
      <div className={`space-y-4 ${className}`}>
         {users.map((user) => (
            <UserCard key={user._id} user={user} />
         ))}
      </div>
   );
}

export default UserList;
