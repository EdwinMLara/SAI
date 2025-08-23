const SystemResponses = {
   ok: 'Successfull',
   missingFieldBody: 'Ocurrió un error de nuestra parte.',
   invalidJwtToken: 'Por seguridad, no es posible realizar esta acción.',
   serverError:
      'Ocurrió un error interno. Estaremos diagnosticando el problema',
   unauthorizedRole: 'No tienes autorización para realizar esta acción.',
   authenticationError: 'Hubo un problema de autenticación.',
   badRequest: 'Hubo un problema en la solicitud.',
};

export default SystemResponses;
