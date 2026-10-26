# Vista previa de QR médicos en ATABEYAPP Web

## Uso

Tras vincular el ordenador mediante el QR temporal habitual, la cabecera de la planilla muestra **Mis QR médicos → Vista previa de mis QR**. La ventana permite seleccionar los QR disponibles, ampliarlos y abrir **la información de ese QR** en otra pestaña con el lector médico existente. La lista mantiene sus colores y diseños actuales; no añade nuevos tipos clínicos ni cambia cuándo corresponde cada uno.

La entrada pública `web.html` conserva exclusivamente el QR temporal de vinculación. La nueva vista se crea dentro de una sesión web vinculada; la aplicación principal conserva su acceso rápido de emergencia.

## Historial confirmado y sesión

- Al abrir, se comprueba la sesión delegada y se consulta el historial mediante `ProfileSync.checkRemote(true)`. Si ya hay una sincronización en curso, se espera a que termine. No se muestra una copia anterior cuando no se puede verificar la consulta.
- Se genera desde `MedicalOwner.read()`, que contiene el perfil confirmado y vinculado al propietario. Los cambios sin guardar siguen en la planilla y en su borrador privado; la vista previa no los publica.
- Se reutilizan `QR_TYPES`, sus condiciones, `buildQRUrl`, la carga local de QRCode y el renderizador orgánico existentes. Los ocho tipos se ofrecen únicamente cuando corresponden al perfil guardado. Cada URL debe pertenecer al lector de ATABEYAPP y al ID de la sesión.
- Los eventos de publicación/sincronización confirmada regeneran la vista abierta. Las respuestas tardías y las generaciones anteriores se descartan si se cerró la ventana, cambió la revisión o dejó de ser válida la sesión.
- Al cerrar o bloquearse la sesión se retiran del diálogo los nombres, las imágenes y los enlaces. El bloqueo conserva su botón de recuperación operativo; ningún diálogo modal lo deja inaccesible.

La información médica se abre en el lector habitual, que consulta el historial confirmado. No se inserta en un iframe ni se reducen las restricciones de `_headers`. Los enlaces usan `noopener noreferrer`.

## Alcance técnico y costes

Archivos nuevos: `js/web-qr-preview.js` y `css/web-qr-preview.css`. La integración añade una tarjeta exclusiva de la sesión vinculada y 12 etiquetas en los once diccionarios. La caché de recursos pasa a `doctorqr-v22` para entregar los nuevos archivos.

No cambia el backend, las credenciales, los planes, la base de datos, el formulario, las reglas clínicas, los lectores médicos ni el protocolo de guardado. Los PNG de esta vista se generan en memoria del navegador: no se suben ni se guardan en una caché médica o base de datos. Cada apertura verifica la sesión y lee el historial con las APIs existentes; no requiere un servicio ni almacenamiento adicional. Las consultas siguen sujetas al uso ordinario de la infraestructura existente.

## Verificación

`tests/web-qr-preview-browser.cjs` utiliza Chromium, identidades ficticias y una API local; bloquea las conexiones externas. Comprueba:

- Igualdad de los módulos de autenticación, propiedad, sincronización, formulario, codificación, lector y cabeceras con la versión anterior. Las traducciones existentes se conservan.
- Dos QR para un perfil sin condiciones adicionales y ocho para un perfil ficticio con las señales correspondientes. Decodifica los PNG realmente generados y los compara con las URLs del codificador existente.
- Separación entre historial confirmado y borrador, conservación de cambios pendientes, actualización desde otro dispositivo y ausencia de escrituras médicas al usar la vista.
- Cierre con Escape, retirada de imágenes y enlaces, bloqueo/recuperación de sesión, rechazo de otra identidad, fallo de conexión, respuestas tardías, sincronización en curso y cierre/reapertura inmediata.
- Apertura del lector habitual con los datos confirmados del propietario, sin utilizar el borrador.
- Geometría de la ventana a 320, 390, 768 y 1360 px en los once idiomas, incluido RTL. La pantalla pública de vinculación y los controles exclusivos de la aplicación principal mantienen su comportamiento.

Además se ejecutan `tests/access-hub-browser.cjs`, `tests/languages.cjs` y `tests/installed-update-browser.cjs` para revisar navegación, traducciones, migración de caché, guardado del formulario, lectura QR y borradores sin conexión. Las pruebas usan tamaños de navegador simulados y datos ficticios; no inspeccionan historias reales ni certifican todos los dispositivos físicos.
