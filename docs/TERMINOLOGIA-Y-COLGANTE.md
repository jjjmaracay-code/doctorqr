# Información médica del usuario y colgante de doble cara

Revisión del 29 de octubre de 2026.

## Redacción

La aplicación describe el contenido del usuario como «tus datos médicos» o «tu información médica», con las adaptaciones necesarias según la frase. Se actualizan las once traducciones de la aplicación, el lector de QR, las vistas web, las tarjetas y accesorios, los avisos de prueba y las plantillas de correo del servidor.

Se mantienen los identificadores internos y las claves de traducción, incluidos `historial`, `renderHistorial` y `family_history`, para conservar enlaces, selectores y datos existentes. Las funciones que presentan el contenido clínico del lector no cambian. El concepto de antecedentes familiares se conserva y las referencias a documentación clínica oficial siguen diferenciándose de los datos introducidos por el usuario.

Es un cambio de redacción solicitado por el propietario del producto. No constituye una validación jurídica, una clasificación sanitaria ni una modificación de los derechos o permisos de acceso. En el backend solo cambian tres mensajes de validación del perfil y el lema de las plantillas de correo; no se cambian envíos, destinatarios, recuperación, autenticación, cifrado, sincronización o pagos.

## Colgante

Se imprimen dos caras unidas que usan exactamente la misma imagen del QR de emergencia. Cada QR mantiene los 40 o 49 mm elegidos. Las dos superficies impresas quedan hacia fuera después de doblar por el centro, antes de plastificar. Las marcas de doblado quedan fuera de las caras y el corte es exterior. Las instrucciones y los controles se presentan en los once idiomas existentes.

Las comprobaciones incluyen la identidad de las matrices, lectura independiente de las dos caras del PNG y del PDF a escala física, ajustes de privacidad y cancelación de exportaciones si cambian la cuenta o los datos publicados. Se utilizan únicamente personas y destinos de prueba ficticios. No se validan porcentajes de daño, impermeabilidad, resistencia mecánica o rendimiento de un accesorio fabricado.

## Verificación

- 173 pruebas del backend, sin acceder a registros reales ni enviar correos.
- `tests/emergency-accessories-browser.cjs`: dos caras, tamaños físicos, idiomas, aislamiento entre cuentas y exportaciones PNG/PDF.
- `tests/emergency-card-browser.cjs`: impresión de la tarjeta de cartera, QR de 49 mm, bordes, once idiomas y nombres extensos.
- `tests/qr-reading-browser.cjs`: contenido de los QR principales y de especialidades; comparación de las funciones clínicas con la versión publicada anterior.
- `tests/installed-update-browser.cjs`: actualización de la aplicación instalada, borradores y descarga de ambas caras sin conexión.

La PWA utiliza `doctorqr-v48` para actualizar los recursos anteriores. No se añaden servicios, dependencias o almacenamiento remoto.
