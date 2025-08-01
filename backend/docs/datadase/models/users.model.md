# Modelo de Usuario

## Objetivo del modelo

El modelo de usuario tiene como objetivo centralizar y estructurar la información relevante de cada usuario de la plataforma, permitiendo su identificación, autenticación y asignación de roles, así como garantizar la integridad y seguridad de los datos almacenados.

## Campos del Modelo

- **image**: Almacena la URL de la imagen del usuario. La imagen se carga mediante la API `api/user/image`, que gestiona el almacenamiento en el servicio S3 y retorna la URL de direccion de la imagen para guardar en este campo.

- **name**: Guarda el nombre real del usuario como una cadena de texto.

- **userName**: Identificador único compuesto por 4 caracteres alfabéticos en mayúscula. Permite identificar al usuario en el cliente sin exponer el nombre completo.

- **phone**: Número de teléfono del usuario. Debe ser un dato único para cada usuario.

- **email**: Correo electrónico del usuario. Se utiliza como identificador único de acceso a la plataforma.

- **password**: Contraseña del usuario, almacenada de forma encriptada utilizando bcrypt con 10 rondas de cifrado para garantizar la seguridad.

- **role**: Define el tipo de usuario en la plataforma. Existen dos roles:
  - **Administrador**: Acceso total a operaciones CRUD, administración de usuarios, gestión de invitaciones y visualización de logs.
  - **Usuario**: Acceso limitado a operaciones CRUD en rutas de la lógica de negocio.
