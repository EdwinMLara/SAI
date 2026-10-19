# Invitaciones

## Objetivo

Gestionar las invitaciones que habilitan el registro de nuevos usuarios. Sin una invitación pendiente asociada a su correo, nadie puede completar el [registro](./register.md).

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/admin/invites` | POST | `Invite.createInvite` | `Identity` + `Authorize('admin')` |
| `/api/admin/invites` | GET | `Invite.getInvites` | `Identity` + `Authorize('admin')` |
| `/api/admin/invites` | DELETE | `Invite.removeInvite` | `Identity` + `Authorize('admin')` |

Controlador: `src/controllers/Invite.controller.ts`. Todas las rutas del módulo `admin` están bajo el rol **administrador**.

## Campos del modelo

Ver [Modelo de Invitación](../datadase/models/invites.model.md). Resumen: `ref` (ObjectId del administrador que la creó), `email` (único) y `role` (`admin` | `user`).

## Flujo general

1. Un administrador crea una invitación para un correo, indicando el rol que tendrá ese usuario.
2. El invitado usa `POST /api/auth/register` con ese correo; el controlador busca la invitación y extrae el rol.
3. El administrador puede listar las invitaciones que él mismo creó (`ref` = su id) o eliminarlas por correo.

## Crear — `POST /api/admin/invites`

- **Campos recibidos:** `email` y `role`.
- `role` debe ser exactamente `admin` o `user`; si falta o es inválido, responde `400`.
- `helpers.validateState(email)` verifica que el correo no tenga ya una invitación ni un usuario existente.
- El `ref` se toma de `req.user.id` (el administrador autenticado).
- Respuesta `201`.

## Listar — `GET /api/admin/invites`

Retorna únicamente las invitaciones creadas por el administrador autenticado.

```json
{
  "status": 200,
  "data": { "message": "...", "invites": [ { "email": "...", "role": "user" } ] }
}
```

## Eliminar — `DELETE /api/admin/invites`

- **Campo recibido:** `email` en el body.
- Si falta el correo responde `409`; si la invitación no existe, `helpers.validateExistence` lanza el error correspondiente.
- Respuesta `200`.

## Normalización de correos

Los correos se guardan y comparan en minúsculas y sin espacios. La búsqueda en MongoDB usa una expresión regular escapada para tolerar variaciones de mayúsculas.
