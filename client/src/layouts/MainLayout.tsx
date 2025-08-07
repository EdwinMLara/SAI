import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@components/semantic/Header';
import Footer from '@components/semantic/Footer';

/* ------------------ Code ------------------ */

const MainLayout: React.FC = () => (
  <div className="main-layout flex flex-col min-h-screen">
    <Header />
    <div className="flex-1 w-full bg-bg transition-colors duration-300 relative overflow-x-hidden">
      <main className="relative w-full">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
    <Footer />
  </div>
);

export default MainLayout;
