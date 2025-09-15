import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home';
import NotFound from '@pages/NotFound';
import MainLayout from '@/pages/MainLayout';
import Protected from './Protected';

import { Profile } from '@app/user';
import RoutingUser from '@app/user/config/Routing';
import { Authentication, Restricted } from '@app/authentication';

/* ------------------ Code ------------------ */

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/auth" element={<Authentication />} />
         <Route path="/restricted" element={<Restricted />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/" element={<MainLayout />}>
            <Route element={<Protected />}>
               <Route index element={<Home />} />
               <Route path="/users/*" element={<RoutingUser />} />
            </Route>
         </Route>
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default AppRoutes;
