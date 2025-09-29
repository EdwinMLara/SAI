const apiPaths = {
   // Authentication
   auth: {
      register: '/auth/register',
      login: '/auth/login',
      logout: '/auth/logout',
      session: '/auth/session',
   },

   // Document management
   documents: {
      upload: (invoiceId: string) => `/documents/${invoiceId}`,
      read: (invoiceId: string) => `/documents/${invoiceId}`,
      update: (invoiceId: string) => `/documents/${invoiceId}`,
      delete: (invoiceId: string) => `/documents/${invoiceId}`,
   },

   // Invoice management
   invoices: {
      create: '/invoices',
      get: (id: string) => `/invoices/${id}`,
      update: (id: string) => `/invoices/${id}`,
      delete: (id: string) => `/invoices/${id}`,
   },

   // Product management
   products: {
      create: '/products',
      get: (key: string) => `/products/${key}`,
      delete: (key: string) => `/products/${key}`,
      replaceAll: '/products/replaceAll',
      lastUpdate: '/products/lastUpdate',
   },

   // Ticket management
   tickets: {
      upload: (ticketId: string) => `/tickets/${ticketId}`,
      read: (ticketId: string) => `/tickets/${ticketId}`,
      update: (ticketId: string) => `/tickets/${ticketId}`,
      delete: (ticketId: string) => `/tickets/${ticketId}`,
   },

   // User management
   user: {
      update: '/user',
      changePassword: '/user/password',
      changeRole: '/user/role',
      changeImage: '/user/image',
      get: '/user',
      invites: {
         create: '/user/invites',
         get: '/user/invites',
         delete: '/user/invites',
      },
   },
};

export default apiPaths;
