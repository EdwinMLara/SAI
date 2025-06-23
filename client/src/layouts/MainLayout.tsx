import React from 'react';
import { Outlet } from 'react-router-dom';
import Navegation from '../components/Navegation/Navegation';

const MainLayout: React.FC = () => (
  <div className="main-layout">
    <Navegation />
    <main>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
