# ATABEYAPP Web — vinculación y edición bimodal

## Uso

1. En el ordenador, abrir https://atabeyapp.app/web.html.
2. En el móvil, abrir la sesión habitual de ATABEYAPP y pulsar **Vincular ordenador**.
3. Escanear el QR con la cámara de esa pantalla. También permite leer una fotografía local del QR cuando la cámara no está disponible.
4. Verificar la cuenta y el navegador, introducir el número que muestra el ordenador, introducir el código del autenticador y confirmar el consentimiento.
5. El ordenador abre el mismo editor, adaptado a una pantalla más amplia. La identidad de registro sigue bloqueada; se pueden editar los datos médicos.
6. Publicar con **Guardar y actualizar mis QR**. Los QR médicos siguen consultando la última versión confirmada en el servidor.

## Sincronización

Se reutilizan `/api/profile/me` y `/api/profile/save`: no se crea otro historial ni otra copia autoritativa. El guardado conserva el cifrado y la validación de identidad existentes. Una revisión antigua no puede sobrescribir otra más reciente: hay que revisar el conflicto.

El editor comprueba cambios remotos al volver a primer plano y cada minuto mientras está visible. Avisa sin reemplazar los campos en edición. **Actualizar historial desde el servidor** recarga y conserva el borrador mediante el mecanismo existente; si difiere del servidor, hay que comparar las versiones. No hay publicación automática ni se presentan borradores como datos ya sincronizados.

## Acceso y privacidad

- QR de vinculación separado de los QR médicos; no incluye datos del paciente.
- Caducidad: 120 segundos, un solo canje mediante transacción y bloqueo de fila.
- El QR contiene un secreto de aprobación; el navegador mantiene otro secreto independiente y una prueba SHA-256 del verificador. Fotografiar el QR no da acceso al canje.
- Confirmación en la aplicación principal, número de vinculación y TOTP obligatorio. No usa códigos de revisión ni excepciones de test.
- Identidad de la cuenta mostrada verificada contra el servidor antes de habilitar la aprobación. Se detiene si cambia la cuenta durante la operación.
- Sesiones web separadas, tokens almacenados como hash en la nueva tabla, máximo 8 horas y nunca más que la sesión primaria que las autorizó.
- Inactividad: cierre de la interfaz a los 15 minutos; límite adicional de 30 minutos en la API sin actividad. Las comprobaciones automáticas de sesión no renuevan la actividad del servidor.
- Permisos delegados limitados a leer/guardar el perfil, comprobar actividad y cerrar su propia sesión. No pueden cambiar contraseña/autenticador, eliminar la cuenta, contratar ni vincular otros ordenadores.
- El móvil puede consultar y revocar accesos. La API rechaza las siguientes peticiones tras revocar; la pantalla lo comprueba cada 30 segundos y al recuperar visibilidad. Una petición ya autorizada y en curso no se cancela retrospectivamente.
- Cerrar la sesión primaria o restablecer su contraseña/autenticador invalida los accesos asociados. El cambio del secreto de autenticación también invalida sesiones web ya emitidas.
- El editor web usa `sessionStorage` de la pestaña para token, perfil y borrador; no sustituye la cuenta persistente que pudiera existir en el ordenador. Cierre explícito/revocación elimina ese material de la pestaña. Los navegadores pueden restaurar pestañas: esto no equivale a borrado forense del equipo.
- Si se pierde la conexión, el ordenador bloquea el historial hasta comprobar la sesión. El modo sin conexión de la aplicación principal no cambia.
- La cámara/imágenes del escáner se procesan localmente con jsQR 1.4.0 (licencia Apache-2.0, incluida con el archivo). No se suben fotografías al servidor.

## Integración y límites

Migración aditiva: nuevas tablas `web_link_challenges`, `web_link_devices` y `web_link_totp_uses`, sin borrar ni reescribir historiales. No se modifican pagos, identidad, recuperación ni claves de cifrado. No requiere proveedor nuevo, dominio nuevo, credenciales ni servicio de pago adicional; sí consume recursos del alojamiento existente.

Las pantallas nuevas de vinculación se entregan inicialmente en español. El editor y el lector QR conservan sus once idiomas y preferencias independientes. No se traduce contenido clínico.

No cambia el alcance del acceso público de los QR médicos ni resuelve la limitación ya documentada de filtrado por especialidad en el servidor.

## Verificación reproducible

- Backend: `npm test` (incluye `tests/web-link.test.cjs`). PostgreSQL embebido, cuentas ficticias: caducidad, secreto del navegador, verificador, TOTP, reutilización, canje concurrente, aislamiento, permisos, revocación, sesión primaria y escritura con revisiones.
- Frontend: `node --test tests/medical-isolation.cjs tests/birthdate.cjs tests/form-audit.cjs tests/profile-sync-dom.cjs tests/languages.cjs` con jsdom disponible.
- Navegador: `tests/web-link-browser.cjs`, con Playwright, pngjs/jsqr y el backend hermano. Genera y decodifica un QR real, lo lee desde una imagen en el escáner de la aplicación, autoriza, abre el editor real, guarda, detecta conflicto y revoca.
- Navegador: `tests/installed-update-browser.cjs`, migración de cachés, identidad bloqueada, once idiomas, QR médico y borrador sin conexión de la aplicación principal.

Estas pruebas no acreditan funcionamiento en todos los modelos de teléfono ni certificación sanitaria. Hay que comprobar el recorrido real en el móvil del titular tras publicar; no se ha usado su cuenta clínica en las pruebas.
