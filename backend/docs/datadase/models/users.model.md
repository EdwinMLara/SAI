# Modelo de Usuario

## Objetivo del modelo

El modelo de usuario tiene como objetivo centralizar y estructurar la información relevante de cada usuario de la plataforma, permitiendo su identificación, autenticación y asignación de roles, así como garantizar la integridad y seguridad de los datos almacenados.

**Archivo:** `src/models/User.model.ts`

## Campos del Modelo

- **image**: Almacena la URL de la imagen de perfil del usuario (campo opcional). Actualmente no existe un endpoint dedicado para su carga; la URL se guarda directamente desde el cliente.

- **name**: Guarda el nombre real del usuario como una cadena de texto. Obligatorio.

- **userName**: Identificador corto del usuario (se asigna desde el campo `username` durante el [registro](../../workflows/register.md)). Obligatorio; se usa para identificar al usuario en el cliente sin exponer el nombre completo.

- **phone**: Número de teléfono del usuario. Debe ser un dato único para cada usuario (índice único).

- **email**: Correo electrónico del usuario. Se utiliza como identificador único de acceso a la plataforma (índice único) y se normaliza a minúsculas.

- **password**: Contraseña del usuario, almacenada de forma encriptada utilizando bcrypt con 10 rondas de cifrado para garantizar la seguridad. Nunca se retorna en las respuestas de la API.

- **role**: Define el tipo de usuario en la plataforma. Es un `enum` obligatorio con dos valores permitidos:
  - **`admin`**: Acceso total a operaciones CRUD, administración de usuarios, gestión de invitaciones y visualización de logs.
  - **`user`**: Acceso limitado a operaciones CRUD en rutas de la lógica de negocio. Es el valor por defecto.

## Relaciones

- Es el usuario autenticado que aparece en `req.user` tras el middleware `Identity`.
- Su `ObjectId` se guarda como `ref` en el [modelo de Invitación](./invites.model.md).
