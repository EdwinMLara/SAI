import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Icon } from '@ui/index.ui';
import { ProductInterface } from '@/core/interfaces/Procuct.interface';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ProductInterface[];
  showImages: boolean;
  onRemoveProduct: (index: number) => void;
  onClearList: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  showImages,
  onRemoveProduct,
  onClearList,
}) => {
  if (products.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-main flex items-center gap-3">
            <Icon name="FaBoxes" size={20} className="text-primary" />
            Productos encontrados ({products.length})
          </h2>
          <Button
            variant="secondary"
            onClick={onClearList}
            className="flex items-center gap-2"
          >
            <Icon name="FaBroom" size={14} />
            Limpiar lista
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={`${product.key}-${idx}`}
              product={product}
              index={idx}
              showImages={showImages}
              onRemove={onRemoveProduct}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductList;
