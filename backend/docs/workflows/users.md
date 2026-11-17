# Usuarios: listado y actualización de perfil

## Objetivo

Aquí está lo poco que se hace con usuarios ya existentes: listarlos (sólo admin) y que cada quien actualice su propio perfil. El alta sigue siendo por [invitación](./invites.md) + [registro](./register.md), y la contraseña tiene su propio flujo en [Recuperación y cambio de contraseña](./password-recovery.md).

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/user/list` | GET | `User.getAllUsers` | `Identity` + `Authorize('admin')` |
| `/api/user` | PUT | `User.updateUser` | `Identity` |
| `/api/user/change-password` | POST | `User.changePassword` | `Identity` |

Controlador: `src/controllers/User.controller.ts`.

## Listar usuarios — `GET /api/user/list`

- Sólo disponible para el rol **administrador**.
- Devuelve todos los usuarios **sin** `password` ni `__v` (proyección `.select('-password -__v')`).

```json
{
  "status": 200,
  "data": {
    "message": "...",
    "users": [
      { "image": "", "name": "...", "userName": "...", "phone": "...", "email": "...", "role": "user" }
    ]
  }
}
```

## Actualizar perfil — `PUT /api/user`

- Actualiza **al usuario autenticado** (`req.user.id`); no permite editar a otros usuarios.
- **Campos aceptados:** `image`, `name`, `userName`, `phone`, `email` (todos opcionales; se aplican sólo los enviados).
- Tras actualizar, se **renueva la cookie `accessToken`** para reflejar los nuevos datos.
- Respuesta `200` con el usuario público actualizado (`image`, `name`, `userName`, `phone`, `email`, `role`).

```json
{
  "status": 200,
  "data": {
    "message": "...",
    "user": { "image": "", "name": "...", "userName": "...", "phone": "...", "email": "...", "role": "user" }
  }
}
```

> **Nota:** la contraseña **no** se cambia por esta ruta. Usa `POST /api/user/change-password`, que valida la contraseña actual y guarda la nueva encriptada con bcrypt.
>
> **Nota:** el endpoint aplica los cambios directamente sobre el documento; no vuelve a comprobar la unicidad de `email`, `userName` ni `phone`. La validación de unicidad existe en el flujo de registro (`helpers.comprobeUnicity`). Si vas a tocar este endpoint, considera mover esa validación aquí también.
>
> **Sobre `image`:** se guarda como URL de texto. No hay subida de archivo en este módulo; la imagen se resuelve del lado del cliente.

## Cambio de contraseña — `POST /api/user/change-password`

Recibe `currentPassword` y `newPassword`, valida la contraseña actual, guarda la nueva encriptada y renueva la cookie `accessToken`. El flujo completo se describe en [Recuperación y cambio de contraseña](./password-recovery.md).

## Relación con otros flujos

- El usuario se crea desde una [invitación](./invites.md) y el [registro](./register.md).
- La sesión (`req.user`) la aporta el middleware `Identity` (ver [Sesión](./session.md)).
- La estructura del documento está en el [Modelo de Usuario](../datadase/models/users.model.md).
