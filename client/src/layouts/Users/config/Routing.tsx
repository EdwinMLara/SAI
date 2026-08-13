import { Routes, Route, Navigate } from 'react-router-dom';

import AdminProtected from '@/routes/AdminProtected';

import UsersList from '../pages/UsersList';
import Invites from '../pages/Invites';

/* ------------------ Code ------------------ */

const Routing = () => {
  return (
    <Routes>
      <Route element={<AdminProtected />}>
        <Route path="/all" element={<UsersList />} />
        <Route path="/invites" element={<Invites />} />
      </Route>
      <Route path="*" element={<Navigate to="/users/all" replace />} />
    </Routes>
  );
};

export default Routing;
