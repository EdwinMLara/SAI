const apiPaths = {
   // Health & Info
   health: '/health',
   info: '/',

   // Authentication
   auth: {
      register: '/auth/register',
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      session: '/auth/session',
   },

   // Admin (Invites)
   admin: {
      invites: '/admin/invites',
   },

   // Products
   products: {
      base: '/products',
      replaceAll: '/products/replaceAll',
   },

   // Documents
   documents: {
      base: '/documents',
   },

   // Tickets
   tickets: {
      base: '/tickets',
   },

   // Invoices
   invoices: {
      base: '/invoices',
   },

   // User
   user: {
      base: '/user',
   },
};

export default apiPaths;
