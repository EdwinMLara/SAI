import { Routes, Route } from 'react-router-dom';

import Protected from './Protected';
import NotFound from '@pages/NotFound';
import MainLayout from '@layouts/MainLayout';
import Authentication from '@/pages/Authentication';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
      <Route element={<Protected />}>
        <Route path="/" element={<MainLayout />}>
          {/* Aqui se renderizarán los componentes del sistema */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
