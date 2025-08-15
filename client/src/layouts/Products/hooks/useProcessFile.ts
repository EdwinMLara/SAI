import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

import { ProductInterface, Prices } from '@interfaces/Procuct.interface';

interface ProcessedData {
  rawData: any[];
  validProducts: ProductInterface[];
  invalidRows: { row: number; error: string; data: any }[];
  totalRows: number;
}

const useProcessFile = () => {
  const [processedData, setProcessedData] = useState<ProcessedData>({
    rawData: [],
    validProducts: [],
    invalidRows: [],
    totalRows: 0,
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cleanValue = (value: any): string | number => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value).trim();
    if (stringValue === '*' || stringValue === '') return 0;
    return stringValue;
  };

  const parsePrice = (value: any): number => {
    const cleaned = cleanValue(value);
    if (cleaned === '' || cleaned === 0) return 0;
    const parsed = Number(cleaned);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  };

  const validateAndTransformRow = (
    row: any,
    index: number
  ): { product?: ProductInterface; error?: string } => {
    try {
      if (!row || typeof row !== 'object') {
        return { error: 'Fila vacía o inválida' };
      }

      const requiredFields = [
        'código',
        'clave',
        'descripción',
        'precio distribuidor con IVA',
        'precio mayoreo con IVA',
        'Precio Medio Mayoreo con IVA',
        'precio público con IVA',
      ];

      const missingFields = requiredFields.filter(
        (field) =>
          !(field in row) ||
          (cleanValue(row[field]) === '' &&
            field !== 'precio distribuidor con IVA' &&
            field !== 'precio mayoreo con IVA' &&
            field !== 'Precio Medio Mayoreo con IVA' &&
            field !== 'precio público con IVA')
      );

      if (missingFields.length > 0) {
        return { error: `Campos faltantes: ${missingFields.join(', ')}` };
      }

      const keyValue = cleanValue(row['código']);
      const descriptionValue = cleanValue(row['descripción']);
      const claveValue = cleanValue(row['clave']);

      if (!keyValue || keyValue === 0) {
        return { error: 'El código del producto es obligatorio' };
      }

      if (!claveValue || claveValue === 0) {
        return { error: 'La clave del producto es obligatoria' };
      }

      if (!descriptionValue || descriptionValue === 0) {
        return { error: 'La descripción del producto es obligatoria' };
      }

      const prices: Prices = {
        distribution: parsePrice(row['precio distribuidor con IVA']),
        wholesale: parsePrice(row['precio mayoreo con IVA']),
        mid_wholesale: parsePrice(row['Precio Medio Mayoreo con IVA']),
        retail: parsePrice(row['precio público con IVA']),
      };

      const product: ProductInterface = {
        key: String(keyValue),
        clave: String(claveValue),
        description: String(descriptionValue),
        prices,
      };

      return { product };
    } catch (err) {
      return { error: 'Error al procesar la fila' };
    }
  };

  const processFile = useCallback((file: File) => {
    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          setError('El archivo está vacío o no contiene datos válidos');
          setIsProcessing(false);
          return;
        }

        const validProducts: ProductInterface[] = [];
        const invalidRows: { row: number; error: string; data: any }[] = [];

        jsonData.forEach((row, index) => {
          const result = validateAndTransformRow(row, index);
          if (result.product) {
            validProducts.push(result.product);
          } else if (result.error) {
            invalidRows.push({
              row: index + 1,
              error: result.error,
              data: row,
            });
          }
        });

        setProcessedData({
          rawData: jsonData,
          validProducts,
          invalidRows,
          totalRows: jsonData.length,
        });

        setError(null);
      } catch (err) {
        setError(
          'Error al procesar el archivo. Verifica que sea un archivo Excel válido'
        );
        setProcessedData({
          rawData: [],
          validProducts: [],
          invalidRows: [],
          totalRows: 0,
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('No se pudo leer el archivo');
      setIsProcessing(false);
      setProcessedData({
        rawData: [],
        validProducts: [],
        invalidRows: [],
        totalRows: 0,
      });
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const resetData = useCallback(() => {
    setProcessedData({
      rawData: [],
      validProducts: [],
      invalidRows: [],
      totalRows: 0,
    });
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    processedData,
    isProcessing,
    error,
    processFile,
    resetData,
  };
};

export default useProcessFile;
