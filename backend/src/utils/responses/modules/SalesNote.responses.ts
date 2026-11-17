const SalesNoteResponses = {
  created: 'Nota de venta creada exitosamente',
  updated: 'Nota de venta actualizada exitosamente',
  stamped: 'Sello fiscal guardado exitosamente',
  deleted: 'Nota de venta eliminada exitosamente',
  notFound: 'Nota de venta no encontrada',
  alreadyExists: 'Ya existe una nota con esa referencia',
  requiredReference: 'El número de referencia es obligatorio',
  requiredCustomer: 'El nombre del cliente es obligatorio',
  requiredProducts: 'La nota debe tener al menos un producto',
  requiredFiscalStamp: 'Faltan datos del sello fiscal',
  invalidFiscalDate: 'La fecha de timbrado no es válida',
  requiredXml: 'El archivo XML es obligatorio',
  invalidXml: 'El archivo no es un CFDI válido',
  xmlWithoutStamp: 'El XML no contiene un timbre fiscal digital',
  incompleteXml: 'El XML no contiene todos los datos del sello fiscal',
  xmlParsed: 'Sello fiscal extraído del XML correctamente',
};

export default SalesNoteResponses;
