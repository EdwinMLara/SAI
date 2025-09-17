interface AlertSortInt {
   [key: string]: 1 | -1;
}

export function sorting(query: any): AlertSortInt {
   const filter: AlertSortInt = {
      createdAt: 1,
   };

   if (typeof query.sort === 'string') {
      const sorts = query.sort.split(',');
      sorts.forEach((sort: string) => {
         const [field, order] = sort.split(':');
         if (field && order && (order === 'asc' || order === 'desc')) {
            filter[field] = order === 'asc' ? 1 : -1;
         }
      });
   }

   return filter;
}
