import { Routes, Route } from 'react-router-dom';

import Protected from './Protected';
import NotFound from '@pages/NotFound';
import MainLayout from '@layouts/MainLayout';
import Authentication from '@/pages/Authentication';

import Home from '@/layouts/Home';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
      <Route path="/" element={<MainLayout />}>
        <Route element={<Protected />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
