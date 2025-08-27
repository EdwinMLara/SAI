import React from 'react';
import { motion } from 'framer-motion';
import { ProductInt } from '@cmm_interfaces/index';

interface ProductPreviewTableProps {
   products: ProductInt[];
   maxPreview?: number;
}

const ProductPreviewTable: React.FC<ProductPreviewTableProps> = ({
   products,
   maxPreview = 3,
}) => {
   const previewProducts = products.slice(0, maxPreview);
   const hasMoreProducts = products.length > maxPreview;

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="mb-6"
      >
         <h4 className="font-semibold text-primary-color mb-3">
            Vista previa de productos válidos (primeros {maxPreview})
         </h4>

         <div className="overflow-x-auto">
            <table className="w-full text-sm border border-light rounded-md">
               <thead>
                  <tr className="bg-tertiary">
                     <th className="px-4 py-3 text-left text-primary-color border-b border-light">
                        Clave
                     </th>
                     <th className="px-4 py-3 text-left text-primary-color border-b border-light">
                        Descripción
                     </th>
                     <th className="px-4 py-3 text-left text-primary-color border-b border-light">
                        Distribución
                     </th>
                     <th className="px-4 py-3 text-left text-primary-color border-b border-light">
                        Mayoreo
                     </th>
                     <th className="px-4 py-3 text-left text-primary-color border-b border-light">
                        Medio Mayoreo
                     </th>
                     <th className="px-4 py-3 text-left text-primary-color border-b border-light">
                        Menudeo
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {previewProducts.map((product, index) => (
                     <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="border-b border-light last:border-b-0 hover:bg-tertiary/30 transition-colors duration-200"
                     >
                        <td className="px-4 py-3 text-primary-color font-medium">
                           {product.key}
                        </td>
                        <td className="px-4 py-3 text-primary-color">
                           {product.description}
                        </td>
                        <td className="px-4 py-3 text-primary-color">
                           ${product.prices.distribution.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-primary-color">
                           ${product.prices.wholesale.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-primary-color">
                           ${product.prices.mid_wholesale.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-primary-color">
                           ${product.prices.retail.toFixed(2)}
                        </td>
                     </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>

         {hasMoreProducts && (
            <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.3 }}
               className="text-secondary-color text-sm mt-2"
            >
               ... y {products.length - maxPreview} productos más
            </motion.p>
         )}
      </motion.div>
   );
};

export default ProductPreviewTable;
