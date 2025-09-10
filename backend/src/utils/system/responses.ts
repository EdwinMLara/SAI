const SystemResponses = {
   ok: 'Successfull',
   missingFieldBody: 'Ocurrió un error de nuestra parte.',
   serverError: 'Ocurrió un error interno',
   badRequest: 'Hubo un problema en la solicitud.',
};

const TicketResponses = {
   created: 'Ticket creado exitosamente',
   updated: 'Ticket actualizado exitosamente',
   deleted: 'Ticket eliminado exitosamente',
   notFound: 'Ticket no encontrado',
   alreadyExists: 'El ticket ya existe',
   requiredId: 'ID de ticket requerido',
   generated: 'Ticket generado exitosamente',
};

const AuthResponses = {
   loginSuccess: 'Inicio de sesión exitoso',
   logoutSuccess: 'Cierre de sesión exitoso',
   invalidCredentials: 'Credenciales inválidas',
   authError: 'No estas authenticado o tus credenciales vencieron',
   unauthorized: 'No tienes permisos para realizar esta acción.',
};

const UserResponses = {
   created: 'El usuario ha sido creado con éxito',
   updated: 'La información del usuario se actualizó correctamente',
   alreadyexists: 'Ya existe un usuario registrado con este correo electrónico',
   formatError: 'El formato del campo ingresado no es válido',
   notfound: 'No se encontró ningún usuario con la información proporcionada',
   invalidpassword: 'La contraseña ingresada es incorrecta',
   updateError: 'Hubo un error a guardar el usuario',
   inviteNotFound: 'No tienes invitación para acceder',
   dupliedInvite: 'Ya tiene invitación',
};

const DocumentResponses = {
   created: 'Documento creado exitosamente',
   updated: 'Documento actualizado exitosamente',
   deleted: 'Documento eliminado exitosamente',
   notFound: 'Documento no encontrado',
   alreadyExists: 'El documento ya existe',
   requiredId: 'ID de documento requerido',
   uploadError: 'Ocurrió un error al subir el documento a la base de datos',
   uploadSuccess: 'Documento subido exitosamente',
};

const ProductResponses = {
   created: 'Producto creado exitosamente',
   updated: 'Producto actualizado exitosamente',
   deleted: 'Producto eliminado exitosamente',
   replaced: 'Productos reemplazados exitosamente',
   notFound: 'Producto no encontrado',
   alreadyExists: 'El producto ya existe',
   requiredKey: 'Clave de producto requerida',
};

const InvoiceResponses = {
   created: 'Factura creada exitosamente',
   updated: 'Factura actualizada exitosamente',
   deleted: 'Factura eliminada exitosamente',
   notFound: 'Factura no encontrada',
   alreadyExists: 'La factura ya existe',
   requiredId: 'ID de factura requerido',
};

const UnknownResponses = {
   unk: 'Ocurrió un error desconocido, no puede proceder la acción',
};

const responses = {
   System: SystemResponses,
   User: UserResponses,
   Product: ProductResponses,
   Invoice: InvoiceResponses,
   Document: DocumentResponses,
   Ticket: TicketResponses,
   Auth: AuthResponses,
   Unk: UnknownResponses,
};

export default responses;
