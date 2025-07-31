Proceso de registro de un usuario nuevo

Para contar con la posibilidad de registrar un usuario nuevo, debes tomar en cuenta que debe haber una invitación posterior a ello (Vease como crear una invitación). Una vez enlazado tu email a una invitación puedes continuar con el proceso.

Información
Ruta de la api de registro: api/auth/register
Controlador especializado: src/controllers/auth/register.ts

El cliente debe enviar la información que el controlador demanda, es decir, es utiliza la interface UserInterface con los campos mínimos esperados.

El usuario envía los siguientes campos a la api register: nombre, userName, email, password. El controlador busca si existe una invitación, si la existe, extrae el rol especificado y lo añade al registro del usuario.
