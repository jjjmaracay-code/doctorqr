# Contacto de emergencia en un recuadro blanco

Revisión del 29 de octubre de 2026, publicación `doctorqr-v50`.

El reloj, la pulsera y las dos caras del colgante imprimen un recuadro blanco con tres niveles: etiqueta de contacto de emergencia, nombre del contacto seleccionado y teléfono. El nombre del titular queda separado, en su posición anterior.

Se utiliza el nombre y el número que ya pertenecen a la entrada de contacto elegida. Si falta el nombre, se imprime la etiqueta y el teléfono, sin sustituirlo por otro contacto ni por el titular. La opción de ocultar el contacto elimina todo su recuadro del SVG, PNG y PDF. Se conserva la exclusión previa de un número que coincida con el teléfono personal registrado.

Los nombres se distribuyen en líneas medidas con la fuente utilizada en el dibujo. El área inferior y el patrón se adaptan para alojarlos. Los QR conservan sus matrices, destinos, márgenes y tamaños elegidos; no se reducen para añadir el nombre. Los números mantienen sus dígitos y se presentan de izquierda a derecha también en documentos RTL.

Las dos caras del colgante se generan con el mismo contacto y QR. Sus marcas de doblado y la regla de escala se calculan con la altura final. El reloj conserva sus pestañas integradas, los pasos de correa y los márgenes previstos de plástico sellado. Las medidas y la aptitud de una pieza fabricada siguen necesitando comprobación física.

## Verificación

- `tests/emergency-accessories-browser.cjs`: recuadro blanco en los PNG, nombre seleccionado en los PDF reales, teléfono y texto dentro del marco, nombres largos, contacto alternativo, nombre ausente y ocultación completa del contacto.
- Se comprueban por separado ambos QR del colgante y los QR del reloj y pulsera, en PNG y PDF a escala física. Se conservan las comprobaciones de once idiomas, RTL y pantallas estrechas.
- Se mantienen las pruebas de cancelación al cambiar la cuenta, los datos o las opciones. Una segunda cuenta ficticia recibe exclusivamente su QR y su contacto.
- `tests/installed-update-browser.cjs`: actualización a v50 y disponibilidad del nuevo módulo en la aplicación instalada sin conexión, conservando los datos y borradores.

No se modifica el servidor, el formulario de datos médicos, la sincronización, los permisos, los pagos ni la selección de contactos guardados. No hay nuevas dependencias, servicios o copias remotas de datos.
