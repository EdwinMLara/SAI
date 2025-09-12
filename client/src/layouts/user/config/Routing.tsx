import { Routes, Route } from 'react-router-dom';

import Profile from '../pages/Profile';

/* ------------------ Code ------------------ */

const Routing = () => {
   return (
      <Routes>
         <Route path="/profile" element={<Profile />} />
      </Routes>
   );
};

export default Routing;
