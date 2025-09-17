export interface QueryResInt<T> {
   data: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
}
