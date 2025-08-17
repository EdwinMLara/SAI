import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@ui/index.ui';
import { ProductInterface } from '@interfaces/Procuct.interface';

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
      bgColor: 'bg-gradient-to-br from-success-light to-success',
      textColor: 'text-white',
      description: 'Precio para distribuidores',
    },
    {
      label: 'Mayoreo',
      value: product.prices.wholesale,
      icon: 'FaWarehouse',
      bgColor: 'bg-gradient-to-br from-info-light to-info',
      textColor: 'text-white',
      description: 'Venta al por mayor',
    },
    {
      label: 'Medio Mayoreo',
      value: product.prices.mid_wholesale,
      icon: 'FaBoxes',
      bgColor: 'bg-gradient-to-br from-warning-light to-warning',
      textColor: 'text-white',
      description: 'Venta media mayor',
    },
    {
      label: 'Menudeo',
      value: product.prices.retail,
      icon: 'FaShoppingCart',
      bgColor: 'bg-gradient-to-br from-vibrant-purple-light to-vibrant-purple',
      textColor: 'text-white',
      description: 'Venta al público',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-r from-brand-light via-success-light to-info-light rounded-xl p-3 border border-brand shadow-strong">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center shadow-medium">
                <Icon name="FaCheckCircle" size={18} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary-color mb-1">
                ¡Producto Encontrado!
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-medium border border-light overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-tertiary to-white rounded-lg p-6 border border-light">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand rounded-lg">
                      <Icon name="FaTag" size={18} className="text-white" />
                    </div>
                    <h3 className="font-bold text-primary-color text-xl">
                      Información General
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-lg border border-light shadow-soft">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          name="FaBarcode"
                          size={16}
                          className="text-brand"
                        />
                        <p className="text-sm font-semibold text-secondary-color uppercase tracking-wide">
                          Clave del Producto
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-primary-color">
                        {product.key}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border border-light shadow-soft">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="FaInfo" size={16} className="text-brand" />
                        <p className="text-sm font-semibold text-secondary-color uppercase tracking-wide">
                          Descripción
                        </p>
                      </div>
                      <p className="text-primary-color font-medium text-lg leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-tertiary to-white rounded-lg p-6 border border-light">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-success rounded-lg">
                      <Icon
                        name="FaDollarSign"
                        size={18}
                        className="text-white"
                      />
                    </div>
                    <h3 className="font-bold text-primary-color text-xl">
                      Lista de Precios
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {priceCards.map((priceCard, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className={`${priceCard.bgColor} p-5 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                            <Icon
                              name={priceCard.icon}
                              size={18}
                              className={priceCard.textColor}
                            />
                          </div>
                          <div>
                            <p className={`font-bold ${priceCard.textColor}`}>
                              {priceCard.label}
                            </p>
                            <p
                              className={`text-xs ${priceCard.textColor} opacity-90`}
                            >
                              {priceCard.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-3xl font-bold ${priceCard.textColor}`}
                          >
                            ${priceCard.value.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${priceCard.textColor} opacity-75`}
                          >
                            MXN
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {showImages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-8 border-t border-light"
              >
                <div className="bg-gradient-to-r from-tertiary to-white rounded-lg p-6 border border-light">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-warning rounded-lg">
                      <Icon name="FaImage" size={18} className="text-white" />
                    </div>
                    <h3 className="font-bold text-primary-color text-xl">
                      Imagen del Producto
                    </h3>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={`https://www.truper.com/media/import/imagenes/${product.clave}.jpg`}
                        alt={product.description}
                        className="max-w-lg w-full h-80 object-cover rounded-xl border-2 border-light shadow-strong hover:shadow-xl transition-shadow duration-300"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
