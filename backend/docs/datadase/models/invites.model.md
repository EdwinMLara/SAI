# Modelo de Invitación

## Objetivo del modelo

El modelo de invitación tiene como propósito gestionar el acceso controlado de nuevos usuarios a la plataforma, evitando que cualquier usuario externo pueda registrarse sin autorización. Permite al sistema mantener una lista de invitaciones generadas por usuarios internos, asegurando la validación y asignación de roles adecuados.

## Campos del Modelo

- **ref**: Almacena el ObjectId (Mongoose) del usuario interno que generó la invitación. Este campo garantiza la relación entre el usuario que invita y el usuario invitado.

- **email**: Guarda el correo electrónico del usuario que intenta registrarse. Este email es único y otorga el permiso de registro en la plataforma.

- **role**: Define el rol que el administrador asigna al nuevo usuario. El administrador determina el tipo de acceso que tendrá el usuario invitado al momento de aceptar la invitación.
