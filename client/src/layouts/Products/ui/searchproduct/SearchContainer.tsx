import React from 'react';
import { motion } from 'framer-motion';

interface SearchContainerProps {
   children: React.ReactNode;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ children }) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="bg-card shadow-soft border border-light p-6 hover:shadow-medium transition-shadow duration-300"
      >
         {children}
      </motion.div>
   );
};

export default SearchContainer;
