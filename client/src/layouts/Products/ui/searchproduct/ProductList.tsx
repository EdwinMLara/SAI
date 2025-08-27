import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Icon } from '@ui/index.ui';
import { ProductInt } from '@cmm_interfaces/index';
import { ProductCard } from '../../index';

interface ProductListProps {
   products: ProductInt[];
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
            className="space-y-6"
         >
            <div className="bg-gradient-to-r from-brand-light to-success-light rounded-lg p-3 border border-brand">
               <div className="flex sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-card shadow-soft">
                        <Icon name="FaBoxes" size={18} className="text-brand" />
                     </div>
                     <div>
                        <h2 className="text-base font-semibold text-primary-color">
                           Productos Encontrados
                        </h2>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button
                        variant="secondary"
                        onClick={onClearList}
                        className="flex items-center gap-1 hover:bg-gray-50 text-gray-700px-2 py-1 text-xs h-8"
                     >
                        <Icon name="FaBroom" size={12} />
                        Limpiar
                     </Button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {products.map((product, idx) => (
                  <motion.div
                     key={`${product.key}-${idx}`}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.1 }}
                  >
                     <ProductCard
                        product={product}
                        index={idx}
                        showImages={showImages}
                        onRemove={onRemoveProduct}
                     />
                  </motion.div>
               ))}
            </div>
         </motion.div>
      </AnimatePresence>
   );
};

export default ProductList;
