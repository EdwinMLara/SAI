import { Routes, Route } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}></Route>
    </Routes>
  );
};

export default AppRoutes;
