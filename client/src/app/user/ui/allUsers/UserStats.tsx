import React from 'react';
import Icon from '../../../../components/ui/Icon';

interface UserStatsProps {
   totalUsers: number;
   totalAdmins: number;
   totalRegularUsers: number;
   loading?: boolean;
   className?: string;
}

function UserStats({
   totalUsers,
   totalAdmins,
   totalRegularUsers,
   loading = false,
   className = '',
}: UserStatsProps) {
   const stats = [
      {
         name: 'Total de usuarios',
         value: totalUsers,
         color: 'bg-info-light text-info border-info',
         icon: <Icon name="FaUsers" className="w-6 h-6" />,
      },
      {
         name: 'Administradores',
         value: totalAdmins,
         color: 'bg-vibrant-purple-light text-vibrant-purple border-vibrant-purple',
         icon: <Icon name="FaUserShield" className="w-6 h-6" />,
      },
      {
         name: 'Usuarios',
         value: totalRegularUsers,
         color: 'bg-success-light text-success border-success',
         icon: <Icon name="FaUser" className="w-6 h-6" />,
      },
   ];

   return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
         {stats.map((stat) => (
            <div
               key={stat.name}
               className={`bg-card p-6 ${stat.color.split(' ')[2]}`}
            >
               <div className="flex items-center">
                  <div
                     className={`p-3 rounded-md ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}
                  >
                     {stat.icon}
                  </div>
                  <div className="ml-4">
                     <h3 className="text-sm font-medium text-secondary-color">
                        {stat.name}
                     </h3>
                     {loading ? (
                        <div className="h-8 w-16 bg-secondary rounded-md animate-pulse mt-1"></div>
                     ) : (
                        <p className="text-2xl font-bold text-primary-color">
                           {stat.value}
                        </p>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}

export default UserStats;
