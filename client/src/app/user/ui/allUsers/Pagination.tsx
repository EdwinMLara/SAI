import React from 'react';

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   totalItems: number;
   itemsPerPage: number;
   className?: string;
}

function Pagination({
   currentPage,
   totalPages,
   onPageChange,
   totalItems,
   itemsPerPage,
   className = '',
}: PaginationProps) {
   const startItem = (currentPage - 1) * itemsPerPage + 1;
   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

   const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      let startPage = Math.max(
         1,
         currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
         startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
         pages.push(
            <button
               key={1}
               onClick={() => onPageChange(1)}
               className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
            >
               1
            </button>
         );
         if (startPage > 2) {
            pages.push(
               <span
                  key="ellipsis1"
                  className="px-3 py-2 text-sm text-gray-500"
               >
                  ...
               </span>
            );
         }
      }

      for (let i = startPage; i <= endPage; i++) {
         pages.push(
            <button
               key={i}
               onClick={() => onPageChange(i)}
               className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  i === currentPage
                     ? 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700'
                     : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
               }`}
            >
               {i}
            </button>
         );
      }

      if (endPage < totalPages) {
         if (endPage < totalPages - 1) {
            pages.push(
               <span
                  key="ellipsis2"
                  className="px-3 py-2 text-sm text-gray-500"
               >
                  ...
               </span>
            );
         }
         pages.push(
            <button
               key={totalPages}
               onClick={() => onPageChange(totalPages)}
               className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
            >
               {totalPages}
            </button>
         );
      }

      return pages;
   };

   if (totalPages <= 1) {
      return null;
   }

   return (
      <div
         className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
         <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
               Mostrando <span className="font-medium">{startItem}</span> a{' '}
               <span className="font-medium">{endItem}</span> de{' '}
               <span className="font-medium">{totalItems}</span> usuarios
            </div>

            <div className="flex items-center space-x-1">
               <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
               >
                  Anterior
               </button>

               <div className="flex items-center space-x-1">
                  {renderPageNumbers()}
               </div>

               <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
               >
                  Siguiente
               </button>
            </div>
         </div>
      </div>
   );
}

export default Pagination;
