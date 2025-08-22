import React from 'react';
import { motion } from 'framer-motion';
import { Button, Icon } from '@ui/index.ui';
import { H1 } from '@components/semantic';

interface SearchHeaderProps {
  hasResults: boolean;
  onClearAll: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ hasResults, onClearAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
    >
      <H1>Búsqueda de productos</H1>
    </motion.div>
  );
};

export default SearchHeader;
