import { Routes, Route } from 'react-router-dom';

import Protected from './Protected';
import AdminProtected from './AdminProtected';
import NotFound from '@pages/NotFound';
import Restricted from '@pages/Restricted';
import MainLayout from '@/pages/MainLayout';
import Authentication from '@/pages/Authentication';

import Home from '@/layouts/Home';
import ChangeProduct from '@/layouts/Products/ChangeProduct';
import DatabaseProduct from '@/layouts/Products/DatabaseProduct';
import SearchProduct from '@/layouts/Products/SearchProduct';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
      <Route path="restricted" element={<Restricted />} />
      <Route path="/" element={<MainLayout />}>
        <Route element={<Protected />}>
          <Route index element={<Home />} />
          <Route path="/products/search" element={<SearchProduct />} />
          <Route element={<AdminProtected />}>
            <Route path="/products/database" element={<DatabaseProduct />} />
            <Route path="/products/change" element={<ChangeProduct />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
