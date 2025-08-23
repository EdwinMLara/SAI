import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
   isOpen: boolean;
   toggle: () => void;
   open: () => void;
   close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
   children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
   children,
}) => {
   const [isOpen, setIsOpen] = useState(true);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth < 768) {
            setIsOpen(false);
         } else {
            setIsOpen(true);
         }
      };

      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const toggle = () => setIsOpen((prev) => !prev);
   const open = () => setIsOpen(true);
   const close = () => setIsOpen(false);

   return (
      <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
         {children}
      </SidebarContext.Provider>
   );
};

export const useSidebar = (): SidebarContextType => {
   const context = useContext(SidebarContext);
   if (context === undefined) {
      throw new Error('useSidebar must be used within a SidebarProvider');
   }
   return context;
};
