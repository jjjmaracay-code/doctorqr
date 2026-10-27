# Refuerzo del aislamiento de cuentas — 27/10/2026

La prioridad es que una cuenta no adopte datos personales, respuestas médicas, borradores ni imágenes QR de otra. Ante una discrepancia se bloquea o descarta el resultado; no se sustituye por el paciente guardado en el dispositivo que escanea.

## Protecciones añadidas

- La página conserva la identidad de la cuenta con la que se abrió: identificador QR, token y datos personales inmutables. Cambiar cualquiera de esos elementos invalida el contexto anterior, también al volver con el historial del navegador.
- Al cambiar de sesión se oculta inmediatamente la página anterior, se retiran sus QR del documento, se cancelan sus peticiones pendientes y se descartan las revisiones y respuestas mantenidas en memoria. Una respuesta retrasada no puede escribirse en el almacenamiento de la nueva cuenta ni eliminar su borrador.
- La caché de imágenes QR exige cuenta actual, URL del lector oficial y un único identificador que corresponda a esa cuenta. Una imagen antigua no se vuelve a etiquetar con el propietario nuevo. La restauración visual exige la URL exacta vigente; los demás símbolos se regeneran.
- El lector público comprueba el identificador solicitado, el devuelto y la vinculación interna del perfil cuando está presente. Rechaza identificadores ambiguos, respuestas de otro propietario y cambios de destinatario durante la descarga. Sigue sin utilizar datos locales ni campos clínicos no verificados de la URL como alternativa.
- Una respuesta de identidad o credenciales rechazada retira el perfil publicado de la caché. El borrador privado propio se conserva en cuarentena y no se modifica hasta verificar de nuevo la cuenta. Un fallo de red conserva el comportamiento de borrador local del mismo propietario.
- El ordenador vinculado comprueba su contexto antes y después de las respuestas asíncronas. Una comprobación antigua no desbloquea la pantalla ni borra la sesión de una cuenta recién vinculada. El almacenamiento de la pestaña continúa separado de las cuentas persistentes del equipo.
- El backend añade cifrado autenticado ligado a cuenta y QR para los nuevos guardados, conserva la lectura verificada de los formatos anteriores y rechaza alias personales contradictorios.

## Verificación

Backend: 161 pruebas. Frontend: 65 pruebas de aislamiento, sincronización, lector y contrato de QR. Siete de los ocho primeros casos de regresión añadidos reproducían fallos en la versión anterior; ya se rechazan correctamente. Las pruebas usan exclusivamente identidades y datos clínicos ficticios.

Pruebas en Chromium: formulario real con 124 respuestas, API Express y PostgreSQL de pruebas, guardados concurrentes, ocho imágenes QR decodificadas y leídas desde el dispositivo de otro paciente, contactos, once idiomas, cuenta cambiada durante una respuesta de guardado, vinculación/revocación web, vista previa, actualización desde una instalación antigua, uso sin red y vencimiento de la prueba. Los ficheros de prueba están en `tests/`.

Los campos médicos, los criterios de selección de las ocho vistas, el contenido de sus URL y el protocolo de vinculación se conservan. No se han borrado historiales del servidor ni consultado cuentas médicas reales. La versión de caché es `doctorqr-v24`.

## Actualización y límites

Publicar primero el backend compatible con v3. Reconectar y aplicar la actualización en las aplicaciones instaladas. Una aplicación que permanece sin conexión no recibe código nuevo. Esta entrega no puede retirar documentos, imágenes o QR ya exportados a otros lugares, ni verificar que una persona haya introducido datos clínicamente correctos. Tampoco permite prometer riesgo cero.
