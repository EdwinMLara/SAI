import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => (
  <div className="main-layout">
    <main>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
