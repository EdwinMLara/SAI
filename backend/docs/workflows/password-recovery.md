# Recuperación y cambio de contraseña

## Objetivo

Permitir al usuario restablecer su contraseña olvidada mediante un enlace enviado por correo, o cambiarla estando autenticado.

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/auth/forgot-password` | POST | `Auth.forgotPassword` | Libre |
| `/api/auth/reset-password` | POST | `Auth.resetPassword` | Libre |
| `/api/user/change-password` | POST | `User.changePassword` | `Identity` |

## Recuperación olvidada — flujo por correo

### 1. Solicitud — `POST /api/auth/forgot-password`

- **Campo recibido:** `email` (obligatorio, se normaliza a minúsculas).
- Se busca el usuario; si existe se genera un **token de restablecimiento** (`generateResetToken`) con vigencia de **15 minutos**.
- Se envía un correo SMTP (`Email.services.sendPasswordResetEmail`) con el enlace:

```
{ORIGIN_SERVER}/auth/reset-password?token={resetToken}
```

- La respuesta es **200** tanto si el usuario existe como si no (no se filtra la existencia de cuentas).

### 2. Restablecimiento — `POST /api/auth/reset-password`

- **Campos recibidos:** `token` (el del enlace) y `newPassword`.
- Se verifica la firma y vigencia del token (`401` si es inválido).
- Se extrae el `id` del usuario del payload, se verifica que exista, se encripta la nueva contraseña y se actualiza el documento.
- Se limpian las cookies de sesión (el usuario deberá volver a iniciar sesión).
- Respuesta `200`.

## Cambio autenticado — `POST /api/user/change-password`

- **Campos recibidos:** `currentPassword` y `newPassword`.
- Se valida que la contraseña actual sea correcta (comparación bcrypt) antes de aplicar el cambio.
- Se guarda la contraseña nueva encriptada y se renueva la cookie `accessToken`.
- Respuesta `200` con los datos públicos del usuario actualizados.

## Notas de seguridad

- Los tokens de restablecimiento usan la misma clave secreta (`JWT_SECRET`) que los tokens de sesión, pero con duración corta (15 min).
- El plantilla del correo está en español y se envía desde `Sistema SAI <SMTP_FROM>`.
- Las cookies se limpian tras un restablecimiento exitoso para invalidar sesiones abiertas en otros dispositivos.
