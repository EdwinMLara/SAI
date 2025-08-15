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
      gradient:
        'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
      border: ' border border-main',
      textColor: 'text-green-600',
      valueColor: 'text-green-700 dark:text-green-300',
    },
    {
      label: 'Mayoreo',
      value: product.prices.wholesale,
      icon: 'FaWarehouse',
      gradient:
        'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
      border: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600',
      valueColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'Medio Mayoreo',
      value: product.prices.mid_wholesale,
      icon: 'FaBoxes',
      gradient:
        'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
      border: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-600',
      valueColor: 'text-orange-700 dark:text-orange-300',
    },
    {
      label: 'Menudeo',
      value: product.prices.retail,
      icon: 'FaShoppingCart',
      gradient:
        'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
      border: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600',
      valueColor: 'text-purple-700 dark:text-purple-300',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-900/20 rounded-main p-8 border-2 border-primary/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary/15 rounded-2xl">
            <Icon name="FaCheckCircle" size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-main">
              Producto Encontrado
            </h2>
            <p className="text-textSecondary">
              Información detallada del producto
            </p>
          </div>
        </div>

        <div className="bg-card-bg rounded-main shadow-lg border border-main p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="FaTag" size={18} className="text-primary" />
                  <h3 className="font-bold text-main text-lg">
                    Información General
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-main">
                    <p className="text-sm text-textSecondary mb-1">
                      Clave del Producto
                    </p>
                    <p className="text-xl font-bold text-main">{product.key}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-main">
                    <p className="text-sm text-textSecondary mb-1">
                      Descripción
                    </p>
                    <p className="text-main font-medium">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    name="FaDollarSign"
                    size={18}
                    className="text-primary"
                  />
                  <h3 className="font-bold text-main text-lg">Precios</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {priceCards.map((priceCard, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-br ${priceCard.gradient} p-4 rounded-main border ${priceCard.border}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          name={priceCard.icon}
                          size={16}
                          className={priceCard.textColor}
                        />
                        <p
                          className={`text-sm font-semibold ${
                            priceCard.textColor
                          } dark:${priceCard.textColor.replace(
                            'text-',
                            'text-'
                          )}-400`}
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
              className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon name="FaImage" size={18} className="text-primary" />
                <h3 className="font-bold text-main text-lg">
                  Imagen del Producto
                </h3>
              </div>
              <div className="flex justify-center">
                <img
                  src={`https://www.truper.com/media/import/imagenes/${product.clave}.jpg`}
                  alt={product.description}
                  className="max-w-md w-full h-64 object-cover rounded-main border border-main shadow-lg"
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
