import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@ui/index.ui';
import { ProductInterface } from '@/core/interfaces/Procuct.interface';

interface ProductDetailProps {
  product: ProductInterface;
  showImages: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  showImages,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1Vjg1SDEyNVY3NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+CjwvcD4KPC9zdmc+';
    target.className += ' opacity-50';
  };

  const priceCards = [
    {
      label: 'Distribución',
      value: product.prices.distribution,
      icon: 'FaTruck',
      bgColor: 'bg-success-light',
      border: 'border-success',
      textColor: 'text-success',
      valueColor: 'text-success',
    },
    {
      label: 'Mayoreo',
      value: product.prices.wholesale,
      icon: 'FaWarehouse',
      bgColor: 'bg-info-light',
      border: 'border-info',
      textColor: 'text-info',
      valueColor: 'text-info',
    },
    {
      label: 'Medio Mayoreo',
      value: product.prices.mid_wholesale,
      icon: 'FaBoxes',
      bgColor: 'bg-warning-light',
      border: 'border-warning',
      textColor: 'text-warning',
      valueColor: 'text-warning',
    },
    {
      label: 'Menudeo',
      value: product.prices.retail,
      icon: 'FaShoppingCart',
      bgColor: 'bg-vibrant-purple-light',
      border: 'border-medium',
      textColor: 'text-vibrant-purple',
      valueColor: 'text-vibrant-purple',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
        className="bg-brand-light rounded-md p-8 border border-brand"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-brand rounded-md">
            <Icon name="FaCheckCircle" size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-color">
              Producto Encontrado
            </h2>
            <p className="text-secondary-color">
              Información detallada del producto
            </p>
          </div>
        </div>

        <div className="bg-card rounded-md shadow-medium border border-light p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="FaTag" size={18} className="text-brand" />
                  <h3 className="font-bold text-primary-color text-lg">
                    Información General
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-tertiary rounded-md">
                    <p className="text-sm text-secondary-color mb-1">
                      Clave del Producto
                    </p>
                    <p className="text-xl font-bold text-primary-color">
                      {product.key}
                    </p>
                  </div>
                  <div className="p-4 bg-tertiary rounded-md">
                    <p className="text-sm text-secondary-color mb-1">
                      Descripción
                    </p>
                    <p className="text-primary-color font-medium">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="FaDollarSign" size={18} className="text-brand" />
                  <h3 className="font-bold text-primary-color text-lg">
                    Precios
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {priceCards.map((priceCard, idx) => (
                    <div
                      key={idx}
                      className={`${priceCard.bgColor} p-4 rounded-md border ${priceCard.border}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          name={priceCard.icon}
                          size={16}
                          className={priceCard.textColor}
                        />
                        <p
                          className={`text-sm font-semibold ${priceCard.textColor}`}
                        >
                          {priceCard.label}
                        </p>
                      </div>
                      <p
                        className={`text-2xl font-bold ${priceCard.valueColor}`}
                      >
                        ${priceCard.value.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showImages && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 }}
              className="mt-8 border-t border-light pt-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon name="FaImage" size={18} className="text-brand" />
                <h3 className="font-bold text-primary-color text-lg">
                  Imagen del Producto
                </h3>
              </div>
              <div className="flex justify-center">
                <img
                  src={`https://www.truper.com/media/import/imagenes/${product.clave}.jpg`}
                  alt={product.description}
                  className="max-w-md w-full h-64 object-cover rounded-md border border-light shadow-medium"
                  onError={handleImageError}
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
