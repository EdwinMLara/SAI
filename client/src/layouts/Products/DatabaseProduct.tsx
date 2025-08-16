import React, { useState, useEffect } from 'react';

import { InputFile } from '@ui/index.ui';
import Button from '@/components/ui/Button';

import useProcessFile from '@/layouts/Products/hooks/useProcessFile';
import useLastUpdate from '@/layouts/Products/hooks/useLastUpdate';
import { ProductInterface } from '@interfaces/Procuct.interface';

import * as services from '@services/Products.services';

const DatabaseProduct = () => {
  const { processedData, isProcessing, error, processFile, resetData } =
    useProcessFile();
  const {
    lastUpdate,
    isLoading: isLoadingUpdate,
    formatDate,
    refetch,
  } = useLastUpdate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {}, [processedData.totalRows, uploadSuccess]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadSuccess(false);
  };

  const handleFileContinue = () => {
    if (selectedFile && !isProcessing) {
      processFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    await confirmUpload();
  };

  const confirmUpload = async () => {
    setIsUploading(true);
    try {
      await services.replaceAllProducts(processedData.validProducts);
      setUploadSuccess(true);
      refetch();
    } catch (err) {
      console.error('Error al subir productos:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setResetKey((k) => k + 1);
    resetData();
  };

  const renderProcessingResults = () => {
    if (isProcessing) {
      return (
        <div className="mt-6 p-4 bg-card border border-light rounded-md">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
            <span className="text-primary-color font-medium">
              Procesando archivo...
            </span>
          </div>
        </div>
      );
    }

    if (processedData.totalRows === 0) return null;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-card p-6 border border-light rounded-md">
          <h3 className="text-lg font-semibold text-primary-color mb-4">
            Resultados del procesamiento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-tertiary p-4 rounded-md border border-light">
              <div className="text-2xl font-bold text-primary-color">
                {processedData.totalRows}
              </div>
              <div className="text-secondary-color text-sm">Filas totales</div>
            </div>
            <div className="bg-success-light p-4 rounded-md border border-success">
              <div className="text-2xl font-bold text-success">
                {processedData.validProducts.length}
              </div>
              <div className="text-success text-sm">Productos válidos</div>
            </div>
            <div className="bg-error-light p-4 rounded-md border border-error">
              <div className="text-2xl font-bold text-error">
                {processedData.invalidRows.length}
              </div>
              <div className="text-error text-sm">Filas con errores</div>
            </div>
          </div>

          {processedData.validProducts.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-primary-color mb-3">
                Vista previa de productos válidos (primeros 3)
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
                    {processedData.validProducts
                      .slice(0, 3)
                      .map((product, index) => (
                        <tr
                          key={index}
                          className="border-b border-light last:border-b-0"
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
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {processedData.validProducts.length > 3 && (
                <p className="text-secondary-color text-sm mt-2">
                  ... y {processedData.validProducts.length - 3} productos más
                </p>
              )}
            </div>
          )}

          {processedData.invalidRows.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-primary-color mb-3">
                Errores encontrados
              </h4>
              <div className="bg-error-light p-4 rounded-md border border-error max-h-48 overflow-y-auto scrollbar-thin">
                {processedData.invalidRows
                  .slice(0, 10)
                  .map((invalid, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <span className="text-error font-medium text-sm">
                        Fila {invalid.row}: {invalid.error}
                      </span>
                    </div>
                  ))}
                {processedData.invalidRows.length > 10 && (
                  <p className="text-error text-sm mt-2">
                    ... y {processedData.invalidRows.length - 10} errores más
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              type="button"
              variant="primary"
              onClick={handleUpload}
              disabled={
                processedData.validProducts.length === 0 ||
                isUploading ||
                uploadSuccess
              }
              className="flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Subiendo...</span>
                </>
              ) : uploadSuccess ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Subido exitosamente</span>
                </>
              ) : (
                <span>
                  Subir productos ({processedData.validProducts.length})
                </span>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Cargar otro archivo
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-color mb-2">
          Productos
        </h1>
        <p className="text-secondary-color">
          Carga un archivo Excel con los productos del sistema. El sistema
          reconocerá automáticamente las columnas necesarias del formato
          estándar.
        </p>
      </div>

      <div className="bg-card p-6 border border-light rounded-md">
        <div className="max-w-md mx-auto">
          <InputFile
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            onContinue={handleFileContinue}
            disabled={
              isProcessing || uploadSuccess || processedData.totalRows > 0
            }
            resetKey={resetKey}
            helperText="Solo archivos Excel (.xlsx, .xls)"
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-error-light border border-error rounded-md">
            <p className="text-error text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {renderProcessingResults()}

      <div className="bg-card py-3 px-4 border border-light rounded-md">
        <p className="text-primary-color text-sm">
          <span className="font-medium">Última actualización:</span>{' '}
          {isLoadingUpdate ? (
            <span className="animate-pulse">Cargando...</span>
          ) : (
            formatDate(lastUpdate)
          )}
        </p>
      </div>
    </div>
  );
};

export default DatabaseProduct;
