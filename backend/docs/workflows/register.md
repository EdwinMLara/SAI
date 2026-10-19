# Registro de usuarios

## Objetivo

Permitir el alta de un usuario nuevo en la plataforma. El registro no es libre: el correo del usuario debe estar asociado a una invitación previamente creada por un administrador (ver [Invitaciones](./invites.md)).

## Ruta

- **Endpoint:** `POST /api/auth/register`
- **Controlador:** `src/controllers/Auth.controller.ts` → `register`
- **Autenticación:** no requiere sesión (el prefijo `/api/auth/` está exento del middleware `Identity`).

## Campos recibidos

El cliente envía un JSON con los siguientes campos:

- **name**: Nombre real del usuario.
- **username**: Identificador corto del usuario. El controlador lo asigna al campo `userName` del modelo.
- **email**: Correo electrónico. Se normaliza a minúsculas y sin espacios antes de procesarlo.
- **password**: Contraseña en texto plano; se encripta con bcrypt (10 rondas) antes de guardarse.
- **phone**: Número de teléfono (único por usuario).

## Flujo

1. **Verificación de unicidad** (`helpers.comprobeUnicity`): se comprueba que `email`, `userName`, `name` y `phone` no pertenezcan a otro usuario; si alguno está en uso, la respuesta indica el campo (`El <campo> ya está en uso.`).
2. **Verificación de invitación** (`helpers.comprobeInvite`): se busca una invitación pendiente con ese correo. Si no existe, se responde `401`.
3. **Encriptación de la contraseña** con bcrypt.
4. **Asignación del rol**: se extrae el campo `role` (`admin` | `user`) de la invitación encontrada.
5. **Creación del usuario** en MongoDB.
6. **Emisión de sesión**: se generan y envían las cookies `accessToken` (1 h) y `refreshToken` (15 días).
7. **Respuesta `200`** con los datos públicos del usuario (sin contraseña).

> **Nota:** la invitación no se consume ni se elimina automáticamente en este flujo; su gestión corresponde al módulo de invitaciones.

## Respuesta exitosa

```json
{
  "status": 200,
  "data": {
    "message": "<mensaje de usuario creado>",
    "user": { "image": "", "name": "...", "userName": "...", "phone": "...", "email": "...", "role": "user" }
  }
}
```
