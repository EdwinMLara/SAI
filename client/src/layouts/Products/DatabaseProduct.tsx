import React, { useState, useEffect } from 'react';

import { InputFile } from '@ui/index.ui';
import Button from '@/components/ui/Button';

import useProcessFile from '@hooks/useXLSXProcessor';
import { ProductInterface } from '@interfaces/Procuct.interface';

const DatabaseProduct = () => {
  const { processedData, isProcessing, error, processFile, resetData } =
    useProcessFile();
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
    if (processedData.validProducts.length === 0) return;
  };

  const confirmUpload = async () => {
    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploadSuccess(true);
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
        <div className="mt-6 p-4 bg-card-bg border border-main rounded-main">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
            <span className="text-main font-medium">Procesando archivo...</span>
          </div>
        </div>
      );
    }

    if (processedData.totalRows === 0) return null;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-card-bg p-6 border border-main rounded-main">
          <h3 className="text-lg font-semibold text-main mb-4">
            Resultados del procesamiento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-bg p-4 rounded-main border border-main">
              <div className="text-2xl font-bold text-main">
                {processedData.totalRows}
              </div>
              <div className="text-secondary text-sm">Filas totales</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-main border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {processedData.validProducts.length}
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm">
                Productos válidos
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-main border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {processedData.invalidRows.length}
              </div>
              <div className="text-red-600 dark:text-red-400 text-sm">
                Filas con errores
              </div>
            </div>
          </div>

          {processedData.validProducts.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-main mb-3">
                Vista previa de productos válidos (primeros 3)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-main rounded-main">
                  <thead>
                    <tr className="bg-bg">
                      <th className="px-4 py-3 text-left text-main border-b border-main">
                        Clave
                      </th>
                      <th className="px-4 py-3 text-left text-main border-b border-main">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-left text-main border-b border-main">
                        Distribución
                      </th>
                      <th className="px-4 py-3 text-left text-main border-b border-main">
                        Mayoreo
                      </th>
                      <th className="px-4 py-3 text-left text-main border-b border-main">
                        Medio Mayoreo
                      </th>
                      <th className="px-4 py-3 text-left text-main border-b border-main">
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
                          className="border-b border-main last:border-b-0"
                        >
                          <td className="px-4 py-3 text-main font-medium">
                            {product.key}
                          </td>
                          <td className="px-4 py-3 text-main">
                            {product.description}
                          </td>
                          <td className="px-4 py-3 text-main">
                            ${product.prices.distribution.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-main">
                            ${product.prices.wholesale.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-main">
                            ${product.prices.mid_wholesale.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-main">
                            ${product.prices.retail.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {processedData.validProducts.length > 3 && (
                <p className="text-secondary text-sm mt-2">
                  ... y {processedData.validProducts.length - 3} productos más
                </p>
              )}
            </div>
          )}

          {processedData.invalidRows.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-main mb-3">
                Errores encontrados
              </h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-main border border-red-200 dark:border-red-800 max-h-48 overflow-y-auto custom-scrollbar">
                {processedData.invalidRows
                  .slice(0, 10)
                  .map((invalid, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                        Fila {invalid.row}: {invalid.error}
                      </span>
                    </div>
                  ))}
                {processedData.invalidRows.length > 10 && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2">
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
        <h1 className="text-2xl font-bold text-main mb-2">Productos</h1>
        <p className="text-secondary">
          Carga un archivo Excel con los productos del sistema. El sistema
          reconocerá automáticamente las columnas necesarias del formato
          estándar.
        </p>
      </div>

      <div className="bg-card-bg p-6 border border-main rounded-main">
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
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-main">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </p>
          </div>
        )}
      </div>

      {renderProcessingResults()}

      <div className="bg-card-bg py-3 px-4 border border-main rounded-main">
        <p className="text-secondary text-sm">
          <span className="font-medium">Última actualización:</span> 13 de
          agosto, 2025
        </p>
      </div>
    </div>
  );
};

export default DatabaseProduct;
