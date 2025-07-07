const responses = {
  // Autenticación y validación
  INVALID_EMAIL: 'El correo electrónico no está registrado en el sistema.',
  EMAIL_ALREADY_EXISTS: 'El correo electónico ya está asociado a una cuenta.',
  INVALID_PASSWORD: 'La contraseña ingresada es incorrecta.',
  PASSWORD_VALID: 'Contraseña verificada correctamente.',
  BAD_REQUEST: 'La solicitud enviada no es válida.',
  REQUIRED_FILE: 'Debes adjuntar el archivo requerido en la solicitud.',
  INVALID_FILETYPE: 'El tipo de archivo adjuntado no es válido.',
  REQUIRED_INVOICE_ID: 'El identificador de la factura es obligatorio.',
  REQUIRED_TRANSACTION_ID: 'El identificador de la transacción es obligatorio.',
  AT_LEAST_ONE_PRODUCT: 'Debes agregar al menos un producto.',
  EXPIRATION_DATE_ERROR:
    'La fecha de vencimiento debe ser posterior a la fecha de emisión de la factura.',
  INVALID_DATA: 'Los datos proporcionados no son válidos.',

  // Usuarios
  USER_CREATED: 'Usuario creado exitosamente.',
  USER_FOUND: 'Usuario encontrado correctamente.',
  USER_UPDATED: 'Usuario actualizado exitosamente.',
  USER_DELETED: 'Usuario eliminado exitosamente.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  USER_ALREADY_EXISTS: 'El usuario ya existe en el sistema.',

  // Productos
  PRODUCT_CREATED: 'Producto creado exitosamente.',
  PRODUCT_FOUND: 'Producto encontrado correctamente.',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente.',
  PRODUCT_DELETED: 'Producto eliminado exitosamente.',
  PRODUCT_NOT_FOUND: 'Producto no encontrado.',
  PRODUCT_ALREADY_EXISTS: 'El producto ya existe en el sistema.',
  PRODUCTS_DATABASE_UPDATED:
    'Base de datos de productos actualizada exitosamente.',

  // Facturas
  INVOICE_CREATED: 'Factura creada exitosamente.',
  INVOICE_FOUND: 'Factura encontrada correctamente.',
  INVOICE_UPDATED: 'Factura actualizada exitosamente.',
  INVOICE_DELETED: 'Factura eliminada exitosamente.',
  INVOICE_NOT_FOUND: 'Factura no encontrada.',
  INVOICE_ALREADY_EXISTS: 'La factura ya existe en el sistema.',

  // Documentos
  DOCUMENT_URL_GENERATED: 'URL del documento generada correctamente.',
  DOCUMENT_FOUND: 'Documento encontrado correctamente.',
  DOCUMENT_UPDATED: 'Documento actualizado exitosamente.',
  DOCUMENT_DELETED: 'Documento eliminado exitosamente.',
  DOCUMENT_NOT_FOUND: 'Documento no encontrado.',
  DOCUMENT_ALREADY_ATTACHED: 'La factura ya tiene un documento adjunto.',

  // Tickets
  TICKET_URL_GENERATED: 'URL del ticket generada correctamente.',
  TICKET_FOUND: 'Ticket encontrado correctamente.',
  TICKET_UPDATED: 'Ticket actualizado exitosamente.',
  TICKET_DELETED: 'Ticket eliminado exitosamente.',
  TICKET_NOT_FOUND: 'Ticket no encontrado.',
  TICKET_ALREADY_ATTACHED: 'La factura ya tiene un ticket adjunto.',

  // Existencia y unicidad
  ALREADY_EXISTS: 'Este recurso ya existe en el sistema.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  DOES_NOT_EXIST: 'El recurso especificado no existe.',

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

  // Validaciones
  VAL_SERVER_ERROR: 'Ocurrió un error en la validación',
  VAL_REQUIRED: 'Este campo es obligatorio',
  VAL_MIN_LENGTH: 'Debe tener al menos {min} caracteres',
  VAL_MAX_LENGTH: 'No debe exceder de {max} caracteres',
  VAL_ONLY_NUMBERS: 'Solo se permiten números',
  VAL_ONLY_LETTERS: 'Solo se permiten letras',
  VAL_ONLY_LETTERS: 'Solo se permiten letras, números y guion bajo',
  VAL_INVALID_EMAIL: 'El formato del email no es válido',
  VAL_INVALID_PHONE: 'El número de teléfono debe tener 10 dígitos',
  VAL_INVALID_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
  VAL_USERNAME_LENGTH: 'El username debe tener entre 4 y 16 caracteres',
  VAL_ONLY_POSITIVE: 'El valor debe ser positivo',
};

module.exports = responses;
