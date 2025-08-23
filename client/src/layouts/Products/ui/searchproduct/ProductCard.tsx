import React from 'react';
import { motion } from 'framer-motion';
import { Icon, IconButton } from '@ui/index.ui';
import { ProductInterface } from '@interfaces/Procuct.interface';

interface ProductCardProps {
   product: ProductInterface;
   index: number;
   showImages: boolean;
   onRemove: (index: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
   product,
   index,
   showImages,
   onRemove,
}) => {
   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src =
         'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS4zMzMzIDQ2LjY2NjdIMTE0LjY2N1Y1My4zMzMzSDg1LjMzMzNWNDYuNjY2N1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CiAgPHRleHQgeD0iNTAlIiB5PSI2MCUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+CjwvcD4KPC9zdmc+';
      target.className += ' opacity-50';
   };

   const priceCards = [
      {
         label: 'Distribución',
         value: product.prices.distribution,
         bgColor: 'bg-success-light',
         borderColor: 'border-success',
         textColor: 'text-success',
         valueColor: 'text-success',
      },
      {
         label: 'Mayoreo',
         value: product.prices.wholesale,
         bgColor: 'bg-info-light',
         borderColor: 'border-info',
         textColor: 'text-info',
         valueColor: 'text-info',
      },
      {
         label: 'Medio Mayoreo',
         value: product.prices.mid_wholesale,
         bgColor: 'bg-warning-light',
         borderColor: 'border-warning',
         textColor: 'text-warning',
         valueColor: 'text-warning',
      },
      {
         label: 'Menudeo',
         value: product.prices.retail,
         bgColor: 'bg-vibrant-purple-light',
         borderColor: 'border-medium',
         textColor: 'text-vibrant-purple',
         valueColor: 'text-vibrant-purple',
      },
   ];

   return (
      <motion.div
         key={`${product.key}-${index}`}
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: index * 0.1 }}
         className="bg-card rounded-md shadow-medium border border-light p-6 hover:shadow-strong transition-all duration-300 group"
      >
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-brand-light rounded-md">
                  <Icon name="FaBox" size={18} className="text-brand" />
               </div>
               <div>
                  <h3 className="font-bold text-primary-color text-lg">
                     {product.key}
                  </h3>
                  <p className="text-xs text-secondary-color">
                     Código del producto
                  </p>
               </div>
            </div>
            <IconButton
               icon="FaTimes"
               variant="ghost"
               onClick={() => onRemove(index)}
               className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error-light"
               title="Eliminar producto"
            />
         </div>

         <div className="mb-4">
            <p className="text-primary-color font-medium line-clamp-2">
               {product.description}
            </p>
         </div>

         <div className="grid grid-cols-2 gap-3 mb-4">
            {priceCards.map((priceCard, idx) => (
               <div
                  key={idx}
                  className={`${priceCard.bgColor} p-3 rounded-md border ${priceCard.borderColor}`}
               >
                  <p
                     className={`text-xs ${priceCard.textColor} font-medium mb-1`}
                  >
                     {priceCard.label}
                  </p>
                  <p className={`text-lg font-bold ${priceCard.valueColor}`}>
                     ${priceCard.value.toFixed(2)}
                  </p>
               </div>
            ))}
         </div>

         {showImages && (
            <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               transition={{ delay: 0.3 }}
               className="mt-4 border-t border-light pt-4"
            >
               <img
                  src={`https://www.truper.com/media/import/imagenes/${product.clave}.jpg`}
                  alt={product.description}
                  className="w-full h-32 object-cover rounded-md border border-light"
                  onError={handleImageError}
               />
            </motion.div>
         )}
      </motion.div>
   );
};

export default ProductCard;
