import { Routes, Route } from 'react-router-dom';

import Home from '../layouts/Home/Home';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
