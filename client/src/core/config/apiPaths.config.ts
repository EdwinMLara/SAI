export const baseURL = '0.0.0.0:5001';

const entrypoint = '/api';

const apiPaths = {
   // Health & Info
   health: `${entrypoint}/health`,
   info: `${entrypoint}/`,

   // Authentication
   auth: {
      register: `${entrypoint}/auth/register`,
      login: `${entrypoint}/auth/login`,
      logout: `${entrypoint}/auth/logout`,
      refresh: `${entrypoint}/auth/refresh`,
      session: `${entrypoint}/auth/session`,
   },

   // Admin (Invites)
   admin: {
      invites: `${entrypoint}/admin/invites`,
   },

   // Products
   products: {
      base: `${entrypoint}/products`,
      replaceAll: `${entrypoint}/products/replaceAll`,
      lastUpdate: `${entrypoint}/products/lastUpdate`,
   },

   // Documents
   documents: {
      base: `${entrypoint}/documents`,
   },

   // Tickets
   tickets: {
      base: `${entrypoint}/tickets`,
   },

   // Invoices
   invoices: {
      base: `${entrypoint}/invoices`,
   },

   // User
   user: {
      base: `${entrypoint}/user`,
   },
};

export default apiPaths;
