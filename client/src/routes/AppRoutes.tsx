import { Routes, Route } from 'react-router-dom';

import Protected from './Protected';
import NotFound from '@pages/NotFound';
import Restricted from '@pages/Restricted';
import MainLayout from '@/pages/MainLayout';
import Authentication from '@/pages/Authentication';

import Home from '@/pages/Home';

import UserRouting from '@/layouts/user/config/Routing';
import ProductRouting from '@layouts/Products/config/Routing';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/auth" element={<Authentication />} />
         <Route path="restricted" element={<Restricted />} />
         <Route path="/" element={<MainLayout />}>
            <Route element={<Protected />}>
               <Route index element={<Home />} />
            </Route>
            <Route path="products/*" element={<ProductRouting />}></Route>
         </Route>
         <Route path="user/*" element={<UserRouting />}></Route>
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default AppRoutes;
