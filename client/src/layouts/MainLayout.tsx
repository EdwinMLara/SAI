import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useSidebar } from '@context/Sidebar.context';

import Header from '@components/semantic/Header';
import Footer from '@components/semantic/Footer';
import Sidebar from '@components/semantic/Sidebar';

/* ------------------ Code ------------------ */

const MainLayout: React.FC = () => {
  const { isOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="main-layout flex min-h-screen">
      <Sidebar />
      <motion.div
        className="flex flex-col flex-1 min-h-screen"
        animate={{
          marginLeft: isMobile ? '0' : isOpen ? '250px' : '80px',
        }}
        transition={{
          type: 'spring' as const,
          stiffness: 300,
          damping: 30,
        }}
      >
        <Header />
        <div className="flex-1 w-full bg-bg transition-colors duration-300 relative overflow-x-hidden">
          <main className="relative w-full">
            <div className="w-full max-w-7xl mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>
        <Footer />
      </motion.div>
    </div>
  );
};

export default MainLayout;
