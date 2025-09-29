import React, { useState, useEffect, useMemo } from 'react';
import { PublicUserInt } from '@common/interfaces';
import { getUsers } from '../../../core/services/User.services';
import UserStats from '../ui/allUsers/UserStats';
import UserFilters from '../ui/allUsers/UserFilters';
import UserList from '../ui/allUsers/UserList';
import Pagination from '../ui/allUsers/Pagination';
import { H1 } from '@/components/semantic';

function AllUsers() {
   const [users, setUsers] = useState<PublicUserInt[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [roleFilter, setRoleFilter] = useState('');
   const [sortBy, setSortBy] = useState('name');
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalUsers, setTotalUsers] = useState(0);
   const itemsPerPage = 10;

   const filteredAndSortedUsers = useMemo(() => {
      let filtered = users;

      if (searchTerm) {
         const term = searchTerm.toLowerCase();
         filtered = filtered.filter(
            (user) =>
               user.name.toLowerCase().includes(term) ||
               user.email.toLowerCase().includes(term) ||
               user.username.toLowerCase().includes(term)
         );
      }

      if (roleFilter) {
         filtered = filtered.filter((user) => user.role === roleFilter);
      }

      filtered.sort((a, b) => {
         const aValue = a[sortBy as keyof PublicUserInt];
         const bValue = b[sortBy as keyof PublicUserInt];

         if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue);
         }

         return 0;
      });

      return filtered;
   }, [users, searchTerm, roleFilter, sortBy]);

   const paginatedUsers = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredAndSortedUsers.slice(startIndex, endIndex);
   }, [filteredAndSortedUsers, currentPage]);

   const totalAdmins = useMemo(
      () => users.filter((user) => user.role === 'admin').length,
      [users]
   );

   const totalRegularUsers = useMemo(
      () => users.filter((user) => user.role === 'user').length,
      [users]
   );

   const fetchUsers = async () => {
      try {
         setLoading(true);
         setError(null);

         const response = await getUsers({
            page: 1,
            limit: 1000,
            sort: sortBy,
         });

         if (response.data) {
            setUsers(response.data.data);
            setTotalUsers(response.data.pagination.total);
         }
      } catch (err) {
         console.error('Error fetching users:', err);
         setError('Error al cargar los usuarios. Por favor intenta de nuevo.');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, []);

   useEffect(() => {
      const newTotalPages = Math.ceil(
         filteredAndSortedUsers.length / itemsPerPage
      );
      setTotalPages(newTotalPages);

      if (currentPage > newTotalPages && newTotalPages > 0) {
         setCurrentPage(1);
      }
   }, [filteredAndSortedUsers.length, currentPage]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handleSearchChange = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
   };

   const handleRoleFilterChange = (role: string) => {
      setRoleFilter(role);
      setCurrentPage(1);
   };

   const handleSortChange = (sort: string) => {
      setSortBy(sort);
      setCurrentPage(1);
   };

   return (
      <div className="min-h-screen bg-card py-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
               <H1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestión de Usuarios
               </H1>
            </div>

            <div className="space-y-6">
               <UserStats
                  totalUsers={users.length}
                  totalAdmins={totalAdmins}
                  totalRegularUsers={totalRegularUsers}
                  loading={loading}
               />

               <UserFilters
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  roleFilter={roleFilter}
                  onRoleFilterChange={handleRoleFilterChange}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
               />

               <UserList
                  users={paginatedUsers}
                  loading={loading}
                  error={error}
               />

               {!loading && !error && filteredAndSortedUsers.length > 0 && (
                  <Pagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={handlePageChange}
                     totalItems={filteredAndSortedUsers.length}
                     itemsPerPage={itemsPerPage}
                  />
               )}
            </div>
         </div>
      </div>
   );
}

export default AllUsers;
