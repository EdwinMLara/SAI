import { Routes, Route } from 'react-router-dom';

import Protected from './Protected';
import NotFound from '@pages/NotFound';
import MainLayout from '@layouts/MainLayout';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route element={<Protected />}>{/* {Protected elements} */}</Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
