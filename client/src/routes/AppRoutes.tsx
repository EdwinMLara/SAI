import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home';
import NotFound from '@pages/NotFound';
import MainLayout from '@/pages/MainLayout';

import {
   Authentication,
   Restricted,
   AdminProtected,
} from '@app/authentication';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/auth" element={<Authentication />} />
         <Route path="/restricted" element={<Restricted />} />
         <Route path="/" element={<MainLayout />}>
            <Route element={<AdminProtected />}>
               <Route index element={<Home />} />
            </Route>
         </Route>
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default AppRoutes;
