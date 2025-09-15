import { Routes, Route } from 'react-router-dom';

import { AdminProtected } from '@app/authentication/index';

import { AllUsers, Invitations } from '../index';

/* ------------------ Code ------------------ */

const Routing = () => {
   return (
      <Routes>
         <Route element={<AdminProtected />}>
            <Route path="invites" element={<Invitations />} />
            <Route path="all" element={<AllUsers />} />
         </Route>
      </Routes>
   );
};

export default Routing;
