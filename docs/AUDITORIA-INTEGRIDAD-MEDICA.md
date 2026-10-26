# Integridad de datos médicos y QR — 26 de octubre de 2026

## Resultado y alcance
Esta actualización corrige el recorrido planilla → guardado cifrado → dispositivos → lector QR. La política pedida por el propietario es automática: prevalece la última modificación guardada; una planilla sin cambios no sustituye información más reciente. No hay diálogo para elegir versiones.

Las reproducciones y pruebas usan exclusivamente pacientes ficticios. No se ha inspeccionado el historial real del propietario ni confirmado que se hubiera borrado. La actualización no recupera datos que ya hubieran sido eliminados del servidor. No incluye borrados, migraciones, cambios de cuentas, planes, claves ni proveedores.

## Incidencias reproducidas y correcciones
1. **Opciones históricas perdidas al recargar.** La planilla descartaba respuestas que ya no pertenecían a su catálogo: enfermedades, condiciones, cirugías, alergias, relaciones de contacto, peso/talla e idiomas. Ahora restituye esas respuestas como opciones visibles, editables y eliminables. Conserva las propiedades antiguas no editadas, varias profesiones libres, niveles de idioma y gravedades de alergia históricos. La ausencia de una gravedad no se convierte automáticamente en «Leve».
2. **Confusión entre caché y borrador.** Una copia local confirmada antigua podía considerarse un conflicto pendiente. Ahora se usa la versión confirmada del servidor y se conservan únicamente los cambios locales realmente pendientes. Un borrador antiguo no sustituye automáticamente un historial publicado.
3. **Guardados de varios dispositivos.** La interfaz envía los campos que realmente cambiaron desde que cargó la planilla. El servidor los aplica sobre la última historia de la misma cuenta mediante actualizaciones atómicas con reintento. Cambios de campos distintos se conservan; para el mismo campo prevalece el último guardado confirmado. Un guardado sin cambios no modifica la revisión ni la fecha. Una eliminación explícita se guarda directamente.
4. **Información oculta en el lector.** La especialidad ahora determina el orden de las secciones, conservando el contexto adulto completo. Los contactos aparecen también en la primera pestaña, con contador y llamadas cuando existe número. Se muestran detalles de desencadenantes, implantes/material, salud emocional, idiomas, voluntades anticipadas, vacunas, cirugías, viajes, lactancia y países/documentos que antes podían quedar ocultos. La fecha mostrada procede del guardado confirmado.
5. **Selección de QR especializados.** Se consultan las respuestas clínicas reales, incluidas las opciones positivas de dispositivos, alergia grave, tratamiento oncológico, obstetricia y salud emocional. Palabras de nombres, correos o profesiones no activan una especialidad. Se mantienen las frases clínicas históricas compatibles. Dos QR principales siguen disponibles para el adulto sin esas indicaciones; el caso complejo probado genera ocho. Las vistas no diagnostican ni asignan gravedad por sí mismas.
6. **Carga inicial y presentación.** No se permite publicar antes de terminar la carga. Los QR confirmados se dibujan al abrir la planilla sin exigir un nuevo guardado ni desplazarla. Se preservan el diseño orgánico, los ocho colores, las URLs, la matriz y los márgenes de los QR. Los textos de paciente en tarjetas/exportaciones se escapan como texto y las fechas ambiguas no producen una edad inventada.

## Comportamiento entre dispositivos
- Sin conexión se conserva un borrador de la propia cuenta; no se indica publicación exitosa ni se modifica el servidor.
- Los dispositivos abiertos consultan automáticamente los cambios, aproximadamente cada minuto y al recuperar actividad/conexión. Las consultas automáticas se agrupan para evitar una petición por cada control. El botón Actualizar permite consultar antes.
- Una actualización no interrumpe una entrada activa. Los cambios locales sin guardar se mantienen hasta que el usuario los guarda o revierte.
- Los QR consultan el último perfil confirmado al abrirse. No usan el historial del dispositivo que escanea ni los parámetros del enlace como sustitutos clínicos. Un fallo de conexión, ID desconocido o identidad no verificable produce un error explícito.
- El protocolo conserva autenticación, TOTP, plan e identidad de cuenta. Los editores antiguos que intenten suprimir respuestas mediante un envío completo reciben una indicación de actualizar la aplicación.

## Validación reproducible
Resultados antes de publicación:
- Backend completo: **132/132 pruebas** con rutas reales, sesiones, AES-GCM y PostgreSQL embebido (PGlite), incluidos guardados simultáneos, ausencia de cambios, borrados explícitos y aislamiento de pacientes.
- Interfaz/lector/contratos: **75/75 pruebas** con DOM, idiomas, fechas, sincronización y comparación del contrato de URLs/dibujo con `52c773c`.
- `tests/medical-pipeline-browser.cjs`: Chromium, dos editores y otra cuenta que escanea. Los **124 campos sembrados** sobreviven a la recarga; el botón real respeta consentimiento de tutor y revisión de secciones; los ocho PNG generados se decodifican y siguen hasta el lector conectado a las rutas cifradas reales. Verifica contactos, todos los grupos adultos definidos, once idiomas, ausencia de filtración entre cuentas y fallo seguro sin red/ID.
- `tests/web-link-browser.cjs`: vinculación mediante lectura de QR, aprobación TOTP, edición desde ordenador, guardados automáticos por cambios, bloqueo sin conexión, revocación y conservación del almacenamiento de otra cuenta.
- `tests/installed-update-browser.cjs`: actualización desde caché antigua, recuperación privada, identidad bloqueada, once idiomas, anchuras móviles y borrador sin conexión. No se anulan las validaciones del formulario.

Dependencias de QA: Node, jsdom, Playwright/Chromium, pngjs, jsqr y el backend con sus dependencias de desarrollo. Los scripts de navegador buscan el backend en `../backend` (`medical-pipeline-browser.cjs` también acepta `ATABEY_BACKEND_PATH`).

```sh
# Backend, desde su repositorio
node --test tests/*.test.cjs
# Frontend, desde su repositorio con dependencias de QA disponibles
node --test tests/languages.cjs tests/profile-sync-dom.cjs tests/form-audit.cjs tests/medical-isolation.cjs tests/birthdate.cjs tests/medical-reader.cjs tests/qr-contract.cjs
node tests/medical-pipeline-browser.cjs
node tests/web-link-browser.cjs
node tests/installed-update-browser.cjs
```

Las instantáneas de diseño de etapas anteriores no representan el contrato clínico actual; no se usan como evidencia de esta corrección. Las pruebas técnicas no equivalen a validación clínica independiente, auditoría normativa o garantía de ausencia de errores. Las traducciones modifican etiquetas; las respuestas libres del paciente se conservan en su idioma original.

## Publicación
Publicar primero el backend compatible y comprobar su estado SUCCESS en Railway; después la interfaz v19 y el resultado de Cloudflare Pages. Verificar los archivos públicos por contenido y el cierre de las rutas privadas sin autenticación. No crear un perfil real ni consultar historias reales para comprobar el despliegue. La nueva caché HTTP no borra el almacenamiento médico local.
