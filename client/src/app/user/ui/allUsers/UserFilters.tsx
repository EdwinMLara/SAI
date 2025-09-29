import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';

interface UserFiltersProps {
   searchTerm: string;
   onSearchChange: (term: string) => void;
   roleFilter: string;
   onRoleFilterChange: (role: string) => void;
   sortBy: string;
   onSortChange: (sort: string) => void;
   className?: string;
}

function UserFilters({
   searchTerm,
   onSearchChange,
   roleFilter,
   onRoleFilterChange,
   sortBy,
   onSortChange,
   className = '',
}: UserFiltersProps) {
   return (
      <div className={`bg-card p-6 overflow-hidden ${className}`}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
            <div className="space-y-2">
               <label
                  htmlFor="search"
                  className="block text-sm font-medium text-secondary-color"
               >
                  Buscar usuarios
               </label>
               <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Nombre, email o usuario..."
                  className="w-full"
               />
            </div>

            <div className="space-y-2">
               <label
                  htmlFor="role-filter"
                  className="block text-sm font-medium text-secondary-color"
               >
                  Filtrar por rol
               </label>
               <Select
                  value={roleFilter}
                  onChange={(value) =>
                     onRoleFilterChange(
                        Array.isArray(value)
                           ? String(value[0] ?? '')
                           : String(value)
                     )
                  }
                  className="w-full min-w-0"
                  options={[
                     { value: 'all', label: 'Todos los roles' },
                     { value: 'admin', label: 'Administradores' },
                     { value: 'user', label: 'Usuarios' },
                  ]}
               />
            </div>

            <div className="space-y-2">
               <label
                  htmlFor="sort-by"
                  className="block text-sm font-medium text-secondary-color"
               >
                  Ordenar por
               </label>
               <Select
                  value={sortBy}
                  onChange={(value) =>
                     onSortChange(
                        Array.isArray(value)
                           ? String(value[0] ?? '')
                           : String(value)
                     )
                  }
                  className="w-full min-w-0"
                  options={[
                     { value: 'name', label: 'Nombre' },
                     { value: 'email', label: 'Email' },
                     { value: 'role', label: 'Rol' },
                     { value: 'username', label: 'Usuario' },
                  ]}
               />
            </div>
         </div>
      </div>
   );
}

export default UserFilters;
