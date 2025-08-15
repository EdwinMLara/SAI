export interface NavigationItem {
  id: string;
  label: string;
  iconName: string;
  path: string;
  adminOnly?: boolean;
  subItems?: {
    id: string;
    label: string;
    path: string;
    isActive?: boolean;
    adminOnly?: boolean;
  }[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    iconName: 'FaHome',
    path: '/',
  },
  {
    id: 'documents',
    label: 'Documentos',
    iconName: 'FaFileAlt',
    path: '/documents',
  },
  {
    id: 'invoices',
    label: 'Facturas',
    iconName: 'FaFileInvoice',
    path: '/invoices',
  },
  {
    id: 'tickets',
    label: 'Tickets',
    iconName: 'FaTicketAlt',
    path: '/tickets',
  },
  {
    id: 'products',
    label: 'Productos',
    iconName: 'FaBox',
    path: '/products',
    subItems: [
      {
        id: 'buscar-producto',
        label: 'Buscar Producto',
        path: '/products/search',
      },
      {
        id: 'products',
        label: 'Editar producto',
        path: '/products/quotations',
      },
      {
        id: 'base-datos',
        label: 'Base de datos',
        path: '/products/database',
      },
    ],
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    iconName: 'FaUsers',
    path: '/users',
    adminOnly: true,
    subItems: [
      {
        id: 'all-users',
        label: 'Todos los Usuarios',
        path: '/users/all',
        adminOnly: true,
      },
      {
        id: 'invites',
        label: 'Invitaciones',
        path: '/users/invites',
        adminOnly: true,
      },
    ],
  },
];

export default navigationItems;
