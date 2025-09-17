export interface PaginationInt {
   page: number;
   limit: number;
}

export function pagination(query: any): PaginationInt {
   const filter: PaginationInt = {
      page: 1,
      limit: 5,
   };

   filter.limit = Number(query.limit) > 0 ? Number(query.limit) : 5;
   filter.page = Number(query.page) > 0 ? Number(query.page) : 1;

   return filter;
}
