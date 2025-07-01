const responses = {
  // Autenticación y validación
  INVALID_EMAIL: 'El correo electrónico no está registrado en el sistema.',
  EMAIL_ALREADY_EXISTS: 'El correo electónico ya esta asociado a ima',
  INVALID_PASSWORD: 'La contraseña ingresada es incorrecta.',
  BAD_REQUEST: 'La solicitud enviada no es válida.',
  REQUIRED_FILE: 'Debes adjuntar el archivo requerido en la solicitud.',
  INVALID_FILETYPE: 'El tipo de archivo adjuntado no es válido.',
  REQUIRED_INVOICE_ID: 'El identificador de la factura es obligatorio.',
  AT_LEAST_ONE_PRODUCT: 'Debes agregar al menos un producto.',
  EXPIRATION_DATE_ERROR:
    'La fecha de vencimiento debe ser posterior a la fecha de emisión de la factura.',
  ERROR_DEV: 'Ha ocurrido un error interno. Por favor, contacta al soporte.',

  // Existencia y unicidad
  ALREADY_EXISTS: 'Este recurso ya existe en el sistema.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  DOES_NOT_EXIST: 'El recurso especificado no existe.',
  DOCUMENT_ALREADY_ATTACHED: 'La factura ya tiene un documento adjunto.',
  TICKET_ALREADY_ATTACHED: 'La factura ya tiene un ticket adjunto.',

  // Éxito
  CREATED: 'El recurso se creó correctamente.',
  RETRIEVED: 'El recurso se obtuvo correctamente.',
  UPDATED: 'El recurso se actualizó correctamente.',
  DELETED: 'El recurso se eliminó correctamente.',
  URL_GENERATED: 'La URL se generó correctamente.',
  UPDATE_SUCCESS_DB: 'La actualización en la base de datos fue exitosa.',

  // Errores
  SERVER_ERROR: 'Ha ocurrido un error en el servidor. Intenta nuevamente.',
  INTERNAL_SERVER_ERROR:
    'Error interno del servidor. No se pudo completar la operación.',
  UNKNOWN_ERROR:
    'Ha ocurrido un error desconocido. Por favor, intenta más tarde.',

  INTERFACE_VALUE_ERROR:
    'Los datos proporcionados no cumplen con el formato requerido.',
};

module.exports = responses;
