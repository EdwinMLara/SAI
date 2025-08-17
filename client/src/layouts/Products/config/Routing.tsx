import { Routes, Route } from 'react-router-dom';

import AdminProtected from '@/routes/AdminProtected';

import DatabaseProduct from '../pages/DatabaseProduct';
import SearchProduct from '../pages/SearchProduct';
import Quotations from '../pages/Quotations';

/* ------------------ Code ------------------ */

const Routing = () => {
  return (
    <Routes>
      <Route element={<AdminProtected />}>
        <Route path="/database" element={<DatabaseProduct />} />
      </Route>
      <Route path="/search" element={<SearchProduct />} />
      <Route path="/quotations" element={<Quotations />} />
    </Routes>
  );
};

export default Routing;
