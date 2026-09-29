import { Routes, Route } from 'react-router-dom';

import Protected from './Protected';
import NotFound from '@pages/NotFound';
import Restricted from '@pages/Restricted';
import MainLayout from '@/pages/MainLayout';
import Authentication from '@/pages/Authentication';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ChangePassword from '@/pages/ChangePassword';

import Home from '@/pages/Home';

import RoutingProducts from '@/layouts/Products/config/Routing';
import RoutingInvoices from '@/layouts/Invoices/config/Routing';
import RoutingUsers from '@/layouts/Users/config/Routing';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="restricted" element={<Restricted />} />
      <Route path="/" element={<MainLayout />}>
        <Route element={<Protected />}>
          <Route index element={<Home />} />
          <Route path="account/change-password" element={<ChangePassword />} />
          <Route path="products/*" element={<RoutingProducts />} />
          <Route path="invoices/*" element={<RoutingInvoices />} />
          <Route path="users/*" element={<RoutingUsers />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;