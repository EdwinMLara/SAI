import React from 'react';
import { motion } from 'framer-motion';
import { Button, Icon } from '@ui/index.ui';
import { H1 } from '@components/semantic';

interface SearchHeaderProps {
  hasResults: boolean;
  onClearAll: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  hasResults,
  onClearAll,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <H1>Búsqueda de productos</H1>

      {/* {hasResults && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            onClick={onClearAll}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Icon name="FaTrash" size={16} />
            Limpiar búsquedas
          </Button>
        </motion.div>
      )} */}
    </motion.div>
  );
};

export default SearchHeader;
